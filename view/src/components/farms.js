import React, { Component } from "react";
import Address from "../extras/address_autocomplete_field";
import CardSkeletons from "../extras/skeleton";
import CustomTable from "../extras/table";
import Filters from "./filters";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Chip from "@material-ui/core/Chip";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submitButton: {
    display: "block",
    color: "white",
    textAlign: "center",
    position: "absolute",
    top: "14px",
    right: "10px",
  },
  floatingButton: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
  },
  clearSearchButton: {
    position: "relative",
  },
  searchBars: {
    marginTop: theme.spacing(3),
  },
  form: {
    width: "calc(100% - 32px)",
    marginLeft: "12px",
    marginTop: theme.spacing(3),
  },
  divider: {
    padding: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: "470px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  position: {
    marginBottom: "12px",
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "32px",
    width: "32px",
    left: "50%",
    top: "35%",
  },
  dialogStyle: {
    maxWidth: "50%",
  },
  viewRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },
  chip: {
    margin: "4px",
  },
  farmLocation: {
    maxWidth: "280px",
  },
  tablePadding: {
    marginTop: "24px",
  },
});

/** Structure for contacts table */
let tableState = {
  columns: [
    { title: "Role", field: "contactRole" },
    { title: "Name", field: "contactName" },
    { title: "Email", field: "contactEmail" },
    { title: "Phone Number", field: "contactPhone" },
  ],
  data: [],
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This function sets up the mask used for the phone input of (***) ***-****
 * where * represents a digit
 */
function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

/**
 * This class represents a Farm component, which is a sub-page of the
 * home page where farm objects are visualized, created, updated, edited,
 * and deleted.
 */
class Farms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Search states
      data: "",
      filteredData: [],
      nameQuery: "",
      locationQuery: "",
      tagsQuery: [],
      allFarmTags: [],
      // Farm states
      farmName: "",
      farmId: "",
      farmTags: [],
      contacts: [],
      forklift: false,
      loadingDock: false,
      location: "",
      locationId: "",
      transportation: false,
      // Aggregated tags used for options when editing a specific farm
      unfilteredFarmTags: [],
      // Page states
      errors: [],
      open: false, //  Used for opening the farm edit/create dialog (form)
      uiLoading: true,
      buttonType: "",
      viewOpen: false, //  Used for opening the farm view dialog
    };

    this.onTagsChange = this.onTagsChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);

    this.handleStringSearch = this.handleStringSearch.bind(this);
    this.simpleSearch = this.simpleSearch.bind(this);

    this.populateAllFarmTags = this.populateAllFarmTags.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.searchTagQuery = this.searchTagQuery.bind(this);

    this.handleResultsRender = this.handleResultsRender.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.updateCards = this.updateCards.bind(this);
  }

  /** Begin functions for sorting menu on top of the page */

  /** Update a stringQuery and search the cards by the specified query variable */
  handleStringSearch = (queryName, event) => {
    // queryName is used instead of event.target.name or event.target.id
    // since both onChange and onSelect call this function with id and name
    const { value } = event.target;
    if (value) {
      this.setState(
        {
          [queryName]: value,
        },
        this.simpleSearch(queryName, value)
      );
    }
  };

  /** Search the cards by the current tagQueries. */
  searchTagQuery = () => {
    this.state.tagsQuery.map((item) => this.simpleSearch("tags-search", item));
  };

  /** Combine all tags in filteredData items to update tags that user can select */
  populateAllFarmTags = () => {
    const { filteredData } = this.state;
    var populatedTags = [];
    filteredData.map((data) =>
      populatedTags.push.apply(populatedTags, data.farmTags)
    );
    // Get unique tags only
    const populatedUniqueTags = [...new Set(populatedTags)];

    this.setState({
      allFarmTags: populatedUniqueTags,
    });
  };

  /** Update tagQueries and search the cards by tags */
  handleTagFilter = (event, values) => {
    if (values.length === 0) {
      return;
    }
    const prevValues = this.state.tagsQuery;
    // If the user has removed one of the previous tags, reset all search queries
    if (values.length < prevValues.length) {
      this.resetCards();
    } else {
      this.setState(
        {
          // Search state
          tagsQuery: [...values],
        },
        // Use callback to ensure that tagsQuery has updated before searching tags
        // Avoid adding parameters: it causes timing issues with the callback
        this.searchTagQuery
      );
    }
  };

  /** Makes appropriate search by field and query of the data, updates filtered page states */
  simpleSearch = (field, query) => {
    var multiFilteredData = [];

    switch (field) {
      case "nameQuery":
        multiFilteredData = this.state.filteredData.filter((farm) =>
          farm.farmName.toLowerCase().includes(query.toLowerCase())
        );
        break;
      case "locationQuery":
        multiFilteredData = this.state.filteredData.filter((farm) =>
          farm.location.toLowerCase().includes(query.toLowerCase())
        );
        break;
      case "tags-search":
        multiFilteredData = this.state.filteredData.filter((farm) =>
          farm.farmTags.includes(query)
        );
        break;
    }

    this.setState(
      { filteredData: multiFilteredData },
      // Update farm tags with newly filtered data
      this.populateAllFarmTags
    );
  };

  /** Returns additional search features that are collapsed at first glance */
  extraFiltersAccordion = () => {
    const { locationQuery, filteredData } = this.state;

    return (
      <div>
        <div>
          <Autocomplete
            id="location-search"
            options={filteredData.map((data) => data.location)}
            value={locationQuery}
            onSelect={(e) => this.handleStringSearch("locationQuery", e)}
            fullWidth={true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Farm Locations"
                placeholder="Type or Select a Location"
                variant="outlined"
                onChange={(e) => this.handleStringSearch("locationQuery", e)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
        <div>{this.tagsAutocomplete(false)}</div>
        <Filters database="farms"></Filters>
      </div>
    );
  };

  /** Returns the accordion menu that contains all search and filtering options */
  filteringAccordion = () => {
    const { classes } = this.props;
    const { nameQuery, filteredData } = this.state;

    return (
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Autocomplete
              id="nameQuery"
              options={[...new Set(filteredData.map((data) => data.farmName))]}
              value={nameQuery}
              onSelect={(e) => this.handleStringSearch("nameQuery", e)}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Farm Names"
                  placeholder="Type or Select a Farm Name"
                  variant="outlined"
                  name="nameQuery"
                  onChange={(e) => this.handleStringSearch("nameQuery", e)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </AccordionSummary>
          <AccordionDetails>{this.extraFiltersAccordion()}</AccordionDetails>
          <Grid container alignItem="left">
            <Grid item xs={12}>
              <Box paddingLeft={2} paddingBottom={2}>
                <Button
                  className={classes.clearSearchButton}
                  onClick={this.resetCards}
                  variant="contained"
                  color="primary"
                  size="medium"
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Accordion>
      </div>
    );
  };

  /**
   * Returns tag filtering menu for searching cards.
   * Re-using the autocomplete for the add new/edit farm form
   * causes issues with setting a conditional value for
   * Autocomplete value={}, so separating the two is smoother.
   */
  tagsAutocomplete = () => {
    const { classes } = this.props;
    const { allFarmTags, tagsQuery } = this.state;

    return (
      <Autocomplete
        className={classes.searchBars}
        multiple
        id="tags-search"
        onChange={this.handleTagFilter}
        options={allFarmTags}
        value={tagsQuery}
        fullWidth
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Farm Tags"
            placeholder="Type or Select a Farm Tag"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
    );
  };

  /** Updates filteredData with a new array; used with filters.js queries */
  updateCards = (newValues) => {
    if (newValues.length === 0) {
      return;
    }
    this.setState({
      filteredData: [...newValues],
    });
  };

  /** Reset filteredData to the original page data, upon clicking reset */
  resetCards = () => {
    this.setState(
      {
        filteredData: [...this.state.data],
        nameQuery: "",
        locationQuery: "",
        tagsQuery: [],
      },
      this.populateAllFarmTags
    );
  };

  /** End functions for sorting menu on top of the page */

  /** Renders filtered produce results into Material-UI cards */
  handleResultsRender = () => {
    const { classes } = this.props;
    const { filteredData } = this.state;

    return (
      <div>
        <Grid container spacing={2} alignItem="center">
          {filteredData.map((farm) => (
            <Grid item xs={12}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {farm.farmName}
                  </Typography>
                  {farm.farmTags.map((tag) => (
                    <Chip className={classes.chip} label={tag} size="small" />
                  ))}
                  <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    padding={0}
                    margin={0}
                  >
                    <Box padding={3}>
                      <Typography
                        className={classes.position}
                        color="textSecondary"
                      >
                        Details:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        className={classes.farmLocation}
                      >
                        Location of Farm: {farm.location}
                      </Typography>
                    </Box>
                    {/* TODO(andrewhojel): allow user to choose the point of contact */}
                    {farm.contacts.length > 0 && (
                      <Box padding={3}>
                        <Typography
                          className={classes.position}
                          color="textSecondary"
                        >
                          Point of Contact:
                        </Typography>
                        <Typography variant="body2" component="p">
                          Name: {farm.contacts[0]["contactName"]}
                          <br />
                          Phone: {farm.contacts[0]["contactPhone"]}
                          <br />
                          Email: {farm.contacts[0]["contactEmail"]}
                        </Typography>
                      </Box>
                    )}
                    <Box padding={3}>
                      <Typography
                        className={classes.position}
                        color="textSecondary"
                      >
                        Logistics:
                      </Typography>
                      <Typography variant="body2" component="p">
                        Have Transportation Means:&nbsp;
                        {farm.transportation ? "yes" : "no"}
                        <br />
                        Loading Dock: {farm.loadingDock ? "yes" : "no"}
                        <br />
                        Forklift: {farm.forklift ? "yes" : "no"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => this.handleEditClick({ farm })}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => this.handleDelete({ farm })}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  /**
   * Given an event, this function updates a state (the target of the event)
   * with a new value
   * @param event The event that is attempting to update a state
   */
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /** Used to update tags in form for modifying or adding an item */
  onTagsChange = (event, values) => {
    this.setState({
      // Farm state
      farmTags: values,
    });
  };

  /** Updates the contacts table */
  changeContacts = (data) => {
    this.setState({ contacts: data });
  };

  /** Used to update location from address autocomplete component */
  handleLocation = (newValue) => {
    if (newValue === null) {
      return;
    }
    this.setState({
      // Farm states
      location: newValue.description,
      locationId: newValue.place_id,
    });
  };

  /** Returns the authentication token stored in local storage */
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /** Load in all of the current farms when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/farms")
      .then((response) => {
        this.setState(
          {
            // Farm state
            data: response.data,
            filteredData: response.data,
            // Page state
            uiLoading: false,
          },
          this.populateAllFarmTags
        );

        this.setState({
          unfilteredFarmTags: [...this.state.allFarmTags],
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.alert("error", "Error loading in the farms!");
      });
  }

  /**
   * Takes a farm object as an input and deletes the given farm
   * object from the database
   * @param data A farm object
   */
  handleDelete(data) {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    let farmId = data.farm.farmId;
    axios
      .delete(`farms/${farmId}`)
      .then(() => {
        this.props.alert("success", "Farm successfully deleted!");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Farm!"
        );
      });
  }

  /**
   * Takes a farm object as an input and opens a dialog page to
   * allow the user to update the attributes of the farm object
   * @param data A farm object
   */
  handleEditClick(data) {
    this.setState({
      // Farm states
      farmName: data.farm.farmName,
      farmId: data.farm.farmId,
      contacts: data.farm.contacts,
      farmTags: data.farm.farmTags,
      forklift: data.farm.forklift,
      loadingDock: data.farm.loadingDock,
      location: data.farm.location,
      locationId: data.farm.locationId,
      transportation: data.farm.transportation,
      // Page states
      buttonType: "Edit",
      open: true,
    });
    tableState.data = data.farm.contacts;
  }

  /**
   * Takes a farm object as an input and opens a popup with all the
   * information about the farm (currently not being used -> will be
   * updated to show augmented information)
   * @param data A farm object
   */
  handleViewOpen(data) {
    this.setState({
      // Farm states
      farmName: data.farm.farmName,
      contacts: data.farm.contacts,
      farmTags: data.farm.farmTags,
      forklift: data.farm.forklift,
      loadingDock: data.farm.loadingDock,
      location: data.farm.location,
      locationId: data.farm.locationId,
      transportation: data.farm.transportation,
      // Page states
      viewOpen: true,
    });
  }

  render() {
    const DialogTitle = withStyles(styles)((props) => {
      const { children, classes, onClose, ...other } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </MuiDialogTitle>
      );
    });

    const DialogContent = withStyles((theme) => ({
      viewRoot: {
        padding: theme.spacing(2),
      },
    }))(MuiDialogContent);

    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const { open, errors, viewOpen } = this.state;
    const { unfilteredFarmTags } = this.state;
    /** Set all states to generic value when opening a dialog page */
    const handleAddClick = () => {
      this.setState({
        // Farm states
        farmName: "",
        farmId: "",
        farmTags: [],
        contacts: [],
        forklift: false,
        loadingDock: false,
        location: "",
        locationId: "",
        transportation: false,
        // Page states
        open: true,
      });
      tableState.data = [];
    };

    /**
     * Either updates or submits a new farm object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newFarm = {
        // Farm states
        farmName: this.state.farmName,
        contacts: this.state.contacts,
        farmTags: this.state.farmTags,
        forklift: this.state.forklift,
        loadingDock: this.state.loadingDock,
        location: this.state.location,
        locationId: this.state.locationId,
        transportation: this.state.transportation,
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/farms/${this.state.farmId}`,
          method: "put",
          data: newFarm,
        };
      } else {
        options = {
          url: "/farms",
          method: "post",
          data: newFarm,
        };
      }
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          this.setState({ open: false });
          const alert =
            this.state.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert("success", "Farm has been successfully" + alert);
          window.location.reload();
        })
        .catch((error) => {
          const alert = this.state.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " + alert + " the produce!"
          );
          this.setState({ open: true, errors: error.response.data });
          console.error(error);
        });
    };

    const handleViewClose = () => {
      // Page state
      this.setState({ viewOpen: false });
    };

    const handleDialogClose = (event) => {
      // Page state
      this.setState({ open: false });
    };

    if (this.state.uiLoading === true) {
      return (
        <main className={classes.content}>
          {this.state.uiLoading && <CardSkeletons classes={classes} />}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Fab
            color="primary"
            className={classes.floatingButton}
            aria-label="Add Farm"
            onClick={handleAddClick}
          >
            <AddIcon />
          </Fab>
          <Dialog
            fullScreen
            open={open}
            onClose={handleDialogClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleDialogClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  {this.state.buttonType === "Edit"
                    ? "Edit Farm"
                    : "Create a new Farm"}
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={handleSubmit}
                  className={classes.submitButton}
                >
                  {this.state.buttonType === "Edit" ? "Save" : "Submit"}
                </Button>
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
              <form className={classes.form} noValidate>
                <Grid container spacing={4} allignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="farmName"
                      label="Farm Name"
                      name="farmName"
                      type="text"
                      autoComplete="farmName"
                      helperText={errors.farmName}
                      value={this.state.farmName}
                      error={errors.farmName ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Address
                      handleLocation={this.handleLocation}
                      location={this.state.location}
                      searching={false}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-transportation">
                        Loading Dock Present
                      </InputLabel>
                      <Select
                        value={this.state.loadingDock}
                        onChange={this.handleChange}
                        label="Loading Dock Present"
                        inputProps={{
                          name: "loadingDock",
                          id: "outlined-loadingDock",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-transportation">
                        Forklift Present
                      </InputLabel>
                      <Select
                        value={this.state.forklift}
                        onChange={this.handleChange}
                        label="Forklift Present"
                        inputProps={{
                          name: "forklift",
                          id: "outlined-forklift",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-transportation">
                        Transportation Present
                      </InputLabel>
                      <Select
                        value={this.state.transportation}
                        onChange={this.handleChange}
                        label="Transportation Present"
                        inputProps={{
                          name: "transportation",
                          id: "outlined-transportation",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="farmTags"
                      onChange={this.onTagsChange}
                      options={unfilteredFarmTags}
                      defaultValue={this.state.farmTags}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Farm Tags"
                          placeholder="tags..."
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <div className={classes.tablePadding}>
                  <CustomTable
                    title="Farms Contacts"
                    tableState={tableState}
                    data={this.state.contacts}
                    changeContacts={this.changeContacts}
                  />
                </div>
              </form>
            </Container>
          </Dialog>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItem="center">
              <Grid item xs={12}>
                {this.filteringAccordion()}
              </Grid>
            </Grid>
            {this.handleResultsRender()}
          </Container>

          <Dialog
            onClose={handleViewClose}
            aria-labelledby="customized-dialog-title"
            open={viewOpen}
            fullWidth
            classes={{ paperFullWidth: classes.dialogStyle }}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
              {this.state.farmName}
            </DialogTitle>
            <DialogContent dividers>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                padding={0}
                margin={0}
              >
                <Box padding={3}>
                  <Typography
                    className={classes.position}
                    color="textSecondary"
                  >
                    Details:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Location of Farm: {this.state.location}
                  </Typography>
                </Box>
                <Box padding={3}>
                  <Typography
                    className={classes.position}
                    color="textSecondary"
                  >
                    Logistics:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Have Transportation Means:
                    {this.state.transportation ? "yes" : "no"}
                    <br />
                    Loading Dock: {this.state.loadingDock ? "yes" : "no"}
                    <br />
                    Forklift: {this.state.forklift ? "yes" : "no"}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        </main>
      );
    }
  }
}

export default withStyles(styles)(Farms);
