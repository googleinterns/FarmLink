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
import InputBase from "@material-ui/core/InputBase";
import Chip from "@material-ui/core/Chip";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClearIcon from "@material-ui/icons/Clear";

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
  form: {
    width: "calc(100% - 32px)",
    marginLeft: "12px",
    marginTop: theme.spacing(3),
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
  dialogStyle: {
    maxWidth: "50%",
  },
  viewRoot: {
    margin: "0px",
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
    marginLeft: "0px",
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
  foodbankLocation: {
    maxWidth: "280px",
  },
  formText: {
    marginBottom: "16px",
  },
  tablePadding: {
    marginTop: "24px",
  },
  clearSearchButton: {
    position: "relative",
  },
  searchBars: {
    marginTop: theme.spacing(3),
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
 * Sets up the mask used for the phone input of (***) ***-****
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
 * Represents a Food Bank component, which is a sub-page of the
 * home page where food bank objects are visualized, created, updated, edited,
 * and deleted.
 */
class Foodbank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Search states
      foodbanks: "",
      filteredData: [],
      nameQuery: "",
      locationQuery: "",
      loadSizeQuery: 0,
      fridgeSpaceQuery: 0,
      tagsQuery: [],
      allTags: [],
      // Aggregated tags used for options when editing a specific item
      unfilteredTags: [],
      // Food bank states
      foodbankName: "",
      location: "",
      locationId: "",
      // TODO(andrewhojel): add the hours feature
      foodbankId: "",
      contacts: [],
      forklift: false,
      pallet: false,
      loadingDock: false,
      maxLoadSize: "",
      refrigerationSpaceAvailable: "",
      foodbankTags: [],
      // Page states
      errors: [],
      open: false,
      // Used for opening food banks edit/create dialog (form)
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
      // Used for opening food banks view dialog
      reloadCards: false,
      selectedCard: "",
    };

    this.onTagsChange = this.onTagsChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);

    this.handleStringSearch = this.handleStringSearch.bind(this);
    this.simpleSearch = this.simpleSearch.bind(this);

    this.populateAllTags = this.populateAllTags.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.searchTagQuery = this.searchTagQuery.bind(this);

    this.handleResultsRender = this.handleResultsRender.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.updateCards = this.updateCards.bind(this);
  }

  /** TODO(fatimazali): Create re-usable search filtering component */

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

  /** Combine all tags in filteredData items to update tags that users can select */
  populateAllTags = () => {
    const { filteredData } = this.state;
    let populatedTags = [];
    filteredData.map((data) =>
      populatedTags.push.apply(populatedTags, data.foodbankTags)
    );
    // Get unique tags only
    const populatedUniqueTags = [...new Set(populatedTags)];

    this.setState({
      allTags: populatedUniqueTags,
    });
  };

  /** Update tagQueries and search the cards by tags */
  handleTagFilter = (event, values) => {
    if (values && values.length === 0) {
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

  /** Filters for minimum load size and available refridgeration space */
  capacityFilters = () => {
    return (
      <Grid container spacing={3} alignItem="left">
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Load Size (Pallets)"
            name="loadSizeQuery"
            type="number"
            value={this.state.loadSizeQuery}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            className={styles.searchButton}
            onClick={(e) => this.handleStringSearch("loadSizeQuery", e)}
            variant="outlined"
            color="primary"
            type="number"
            size="medium"
            startIcon={<SearchIcon />}
          >
            Filter by Min Load Size
          </Button>
        </Grid>
      </Grid>
    );
  };

  /** Makes appropriate search by field and query of the data, updates filtered page states */
  simpleSearch = (field, query) => {
    var multiFilteredData = [];
    console.log("query", query);

    switch (field) {
      case "nameQuery":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.foodbankName.toLowerCase().includes(query.toLowerCase())
        );
        break;
      case "locationQuery":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.location.toLowerCase().includes(query.toLowerCase())
        );
        break;
      case "tags-search":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.foodbankTags.includes(query)
        );
        break;
      case "loadSizeQuery":
        multiFilteredData = this.state.filteredData.filter(
          (item) => parseInt(item.maxLoadSize) > query
        );
        break;
    }

    this.setState(
      { filteredData: multiFilteredData },
      // Update tags with newly filtered data
      this.populateAllTags
    );
  };

  /** Returns additional search features that are collapsed at first glance */
  extraFiltersAccordion = () => {
    const { classes } = this.props;
    const { locationQuery, filteredData } = this.state;

    return (
      <div>
        <Grid container spacing={3} alignItem="left">
          <Grid item xs={6}>
            <Autocomplete
              id="location-search"
              options={filteredData.map((data) => data.location)}
              value={locationQuery}
              onSelect={(e) => this.handleStringSearch("locationQuery", e)}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Food Bank Locations"
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
          </Grid>
          <Grid item xs={6}>
            {this.tagsAutocomplete()}
          </Grid>
        </Grid>
        <Filters database="foodbanks"></Filters>
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
              options={[
                ...new Set(filteredData.map((data) => data.foodbankName)),
              ]}
              value={nameQuery}
              onSelect={(e) => this.handleStringSearch("nameQuery", e)}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Foodbank Names"
                  placeholder="Type or Select a Food Bank Name"
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
          <AccordionDetails>
            {this.extraFiltersAccordion()}
            {this.capacityFilters()}
          </AccordionDetails>
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
   * Re-using the autocomplete for the add new/edit item form
   * causes issues with setting a conditional value for
   * Autocomplete value={}, so separating the two is smoother.
   */
  tagsAutocomplete = () => {
    const { classes } = this.props;
    const { allTags, tagsQuery } = this.state;

    return (
      <Autocomplete
        multiple
        id="tags-search"
        onChange={this.handleTagFilter}
        options={allTags}
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
            label="Food Bank Tags"
            placeholder="Type or Select a Food Bank Tag"
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
    // newValues comes from filters.js and will be an array currently
    // If adding more functionality to updateCards(), add more boundary value checks
    if (newValues && newValues.length === 0) {
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
        filteredData: [...this.state.foodbanks],
        nameQuery: "",
        locationQuery: "",
        tagsQuery: [],
      },
      this.populateAllTags
    );
  };

  /** Renders filtered produce results into Material-UI cards */
  handleResultsRender = () => {
    const { classes } = this.props;
    const { filteredData } = this.state;

    return (
      <div>
        <Grid container spacing={2} alignItem="center">
          {this.state.filteredData.map((foodbank) => (
            <Grid item xs={12}>
              <Card
                className={classes.root}
                raised={foodbank.foodbankId === this.state.selectedCard}
                variant={
                  foodbank.foodbankId === this.state.selectedCard
                    ? "elevation"
                    : "outlined"
                }
              >
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {foodbank.foodbankName}
                  </Typography>
                  {foodbank.foodbankTags.map((tag) => (
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
                        className={classes.foodbankLocation}
                      >
                        Location of Food Bank: {foodbank.location}
                        <br />
                        Refrigeration Space (in pallets):
                        {foodbank.refrigerationSpaceAvailable}
                        <br />
                        Max Load Size (in pallets): {foodbank.maxLoadSize}
                      </Typography>
                    </Box>
                    {/* TODO(andrewhojel): allow user to choose the point of contact! */}
                    {foodbank.contacts.length > 0 && (
                      <Box padding={3}>
                        <Typography
                          className={classes.position}
                          color="textSecondary"
                        >
                          Point of Contact:
                        </Typography>
                        <Typography variant="body2" component="p">
                          Role: {foodbank.contacts[0]["contactRole"]}
                          <br />
                          Name: {foodbank.contacts[0]["contactName"]}
                          <br />
                          Phone: {foodbank.contacts[0]["contactPhone"]}
                          <br />
                          Email: {foodbank.contacts[0]["contactEmail"]}
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
                        Forklift: {foodbank.forklift ? "yes" : "no"}
                        <br />
                        Pallet: {foodbank.pallet ? "yes" : "no"}
                        <br />
                        Loading Dock: {foodbank.loadingDock ? "yes" : "no"}
                      </Typography>
                    </Box>
                    {/* TODO(andrewhojel): Determine if we should include hours of foodbanks. */}
                  </Box>
                </CardContent>
                <CardActions>
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleViewOpen({ foodbank })}
                    >
                      View
                    </Button>
                  )}
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleEditClick({ foodbank })}
                    >
                      Edit
                    </Button>
                  )}
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleDelete({ foodbank })}
                    >
                      Delete
                    </Button>
                  )}
                  {this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleSelect({ foodbank })}
                    >
                      Select
                    </Button>
                  )}
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

  /** Used to update tags in form */
  onTagsChange = (event, values) => {
    this.setState({
      foodbankTags: values,
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
      location: newValue.description,
      locationId: newValue.place_id,
    });
  };

  /** Returns the authentication token stored in local storage */
  reFetch = () => {
    this.setState({
      uiLoading: true,
      reLoadCards: true,
      open: false,
    });
    this.reFetchSurplus();
  };

  /** Load in all of the current surplus when the component has mounted */
  reFetchSurplus = () => {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/foodbanks")
      .then((response) => {
        this.setState({
          foodbanks: response.data,
          uiLoading: false,
          reloadCards: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.alert("error", "Error reloading in the foodbanks cards!");
      });
  };

  /** Returns the authentication token stored in local storage */
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /** Load in all of the current food banks when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/foodbanks")
      .then((response) => {
        this.setState(
          {
            foodbanks: response.data,
            filteredData: response.data,
            uiLoading: false,
          },
          this.populateAllTags
        );

        this.setState({
          unfilteredTags: [...this.state.allTags],
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.alert("error", "Error loading in the food banks!");
      });
  }

  /**
   * Takes a food bank object as an input and deletes the given food bank
   * object from the database
   * @param data A food bank object
   */
  handleDelete(data) {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    let foodbankId = data.foodbank.foodbankId;
    axios
      .delete(`foodbanks/${foodbankId}`)
      .then(() => {
        this.reFetch();
        this.props.alert("success", "Food bank successfully deleted!");
      })
      .catch((err) => {
        console.error(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Food Bank!"
        );
      });
  }

  /** Causes selected card to have hover styling applied */
  handleSelect(data) {
    this.setState({ selectedCard: data.foodbank.foodbankId });
  }

  /**
   * Takes a food bank object as an input and opens a dialog page to
   * allow the user to update the attributes of the food bank object
   * @param data A food bank object
   */
  handleEditClick(data) {
    this.setState({
      // food bank states
      foodbankName: data.foodbank.foodbankName,
      location: data.foodbank.location,
      locationId: data.foodbank.locationId,
      // TODO(andrewhojel): add the hours feature
      foodbankId: data.foodbank.foodbankId,
      contacts: data.foodbank.contacts,
      forklift: data.foodbank.forklift,
      pallet: data.foodbank.pallet,
      loadingDock: data.foodbank.loadingDock,
      maxLoadSize: data.foodbank.maxLoadSize,
      refrigerationSpaceAvailable: data.foodbank.refrigerationSpaceAvailable,
      foodbankTags: data.foodbank.foodbankTags,
      // page states
      buttonType: "Edit",
      open: true,
    });
    tableState.data = data.foodbank.contacts;
  }

  /**
   * Takes a food bank object as an input and opens a popup with all the
   * information about the food bank (currently not being used -> will be
   * updated to show augmented information)
   * @param data A food bank object
   */
  handleViewOpen(data) {
    this.setState({
      // food bank states
      foodbankName: data.foodbank.foodbankName,
      location: data.foodbank.location,
      locationId: data.foodbank.locationId,
      // TODO(andrewhojel): add the hours feature
      contacts: data.foodbank.contacts,
      forklift: data.foodbank.forklift,
      pallet: data.foodbank.pallet,
      loadingDock: data.foodbank.loadingDock,
      maxLoadSize: data.foodbank.maxLoadSize,
      refrigerationSpaceAvailable: data.foodbank.refrigerationSpaceAvailable,
      foodbankTags: data.foodbank.foodbankTags,
      // page states
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
    const { unfilteredTags } = this.state;

    /** Set all states to generic value when opening a dialog page */
    const handleAddClick = () => {
      this.setState({
        // Food bank states
        foodbankName: "",
        location: "",
        locationId: "",
        // TODO(andrewhojel): add the hours feature
        foodbankId: "",
        contacts: [],
        forklift: false,
        pallet: false,
        loadingDock: false,
        maxLoadSize: "",
        refrigerationSpaceAvailable: "",
        foodbankTags: [],
        // Page state
        open: true,
      });
      tableState.data = [];
    };

    /**
     * Either updates or submits a new food bank object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newFoodBank = {
        // food bank states
        foodbankName: this.state.foodbankName,
        location: this.state.location,
        locationId: this.state.locationId,
        // TODO(andrewhojel): add the hours feature
        contacts: this.state.contacts,
        forklift: this.state.forklift,
        pallet: this.state.pallet,
        loadingDock: this.state.loadingDock,
        maxLoadSize: parseFloat(this.state.maxLoadSize),
        refrigerationSpaceAvailable: parseFloat(
          this.state.refrigerationSpaceAvailable
        ),
        foodbankTags: this.state.foodbankTags,
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/foodbanks/${this.state.foodbankId}`,
          method: "put",
          data: newFoodBank,
        };
      } else {
        options = {
          url: "/foodbanks",
          method: "post",
          data: newFoodBank,
        };
      }
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          // page state
          this.setState({ open: false });
          const action =
            this.state.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert(
            "success",
            "Food Bank has been successfully" + action
          );
          this.reFetch();
        })
        .catch((error) => {
          // page state
          const action = this.state.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " +
              action +
              " the Food Bank!"
          );
          this.setState({ open: true, errors: error.response.data });
          console.error(error);
        });
    };

    const handleViewClose = () => {
      // page state
      this.setState({ viewOpen: false });
    };

    const handleDialogClose = (event) => {
      // page state
      this.setState({ open: false });
    };

    if (this.state.uiLoading === true) {
      return (
        <main className={classes.content}>
          {this.state.uiLoading && (
            <CardSkeletons classes={classes} noPadding={this.props.inSurplus} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          {this.props.inStepper && (
            <Typography className={(classes.instructions, classes.formText)}>
              Please select a Food Bank to send the Surplus to. If you would
              like to create a new Food Bank, press the addition icon.
            </Typography>
          )}
          <div
            className={!this.props.inStepper ? classes.toolbar : undefined}
          />
          <Fab
            color="primary"
            className={classes.floatingButton}
            aria-label="Add Produce"
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
                    ? "Edit Food Bank"
                    : "Create a new Food Bank"}
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
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="foodbankName"
                      label="Food Bank Name"
                      name="foodbankName"
                      type="text"
                      autoComplete="foodbankName"
                      helperText={errors.foodbankName}
                      value={this.state.foodbankName}
                      error={errors.foodbankName ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Address
                      handleLocation={this.handleLocation}
                      location={this.state.location}
                      searching={false}
                    />
                    {/* can we get the hours from the location query? */}
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-loadingDoc">
                        Loading Dock Present
                      </InputLabel>
                      <Select
                        value={this.state.loadingDock}
                        onChange={this.handleChange}
                        label="Loading Dock Present"
                        inputProps={{
                          name: "loadingDock",
                          id: "outlined-loadingDoc",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-forklift">
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
                      <InputLabel htmlFor="outlined-pallet">
                        Pallet Present
                      </InputLabel>
                      <Select
                        value={this.state.pallet}
                        onChange={this.handleChange}
                        label="Pallet Present"
                        inputProps={{
                          name: "pallet",
                          id: "outlined-pallet",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="maxLoadSize"
                      label="Max Load Size"
                      name="maxLoadSize"
                      type="number"
                      autoComplete="maxLoadSize"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            pallets
                          </InputAdornment>
                        ),
                      }}
                      helperText={errors.maxLoadSize}
                      value={this.state.maxLoadSize}
                      error={errors.maxLoadSize ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="refrigerationSpaceAvailable"
                      label="Refrigeration Space Available"
                      name="refrigerationSpaceAvailable"
                      type="number"
                      autoComplete="refrigerationSpaceAvailable"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            pallets
                          </InputAdornment>
                        ),
                      }}
                      helperText={errors.refrigerationSpaceAvailable}
                      value={this.state.refrigerationSpaceAvailable}
                      error={errors.refrigerationSpaceAvailable ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="foodbankTags"
                      onChange={this.onTagsChange}
                      options={unfilteredTags}
                      defaultValue={this.state.foodbankTags}
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
                          label="Food Bank Tags"
                          placeholder="tags..."
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <div className={classes.tablePadding}>
                  <CustomTable
                    title="Food Bank Contacts"
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
              {this.state.foodbankName}
            </DialogTitle>
            <DialogContent dividers>
              <Chip
                className={classes.chip}
                label="High Food Insecurity"
                size="small"
              />
              <Chip className={classes.chip} label="Major City" size="small" />
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
                    Location of Food Bank: {this.state.location}
                    <br />
                    Refrigeration Space (in pallets):
                    {this.state.refrigerationSpaceAvailable}
                    <br />
                    Max Load Size (in pallets): {this.state.maxLoadSize}
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
                    Forklift: {this.state.forklift ? "yes" : "no"}
                    <br />
                    Pallet: {this.state.pallet ? "yes" : "no"}
                    <br />
                    Loading Dock: {this.state.loadingDock ? "yes" : "no"}
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

export default withStyles(styles)(Foodbank);
