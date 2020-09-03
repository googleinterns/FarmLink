import React, { Component } from "react";
import CardSkeletons from "../extras/skeleton";
import SurplusStepper from "../extras/surplusStepper";
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
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";

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
  skeleton: {
    padding: theme.spacing(1, 1, 1, 0),
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
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },
  table: {
    marginTop: "48px",
  },
  formText: {
    marginBottom: "16px",
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Represents a Surplus component, which is a sub-page of the
 * home page where surplus objects are visualized, created, updated,
 * edited,and deleted.
 */
class Surplus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Search states
      filteredData: [],
      farmNameQuery: "",
      produceNameQuery: "",
      originFarmContactNameQuery: "",
      // Surplus state
      surplusObjects: "",
      surplusId: "",
      produceId: "",
      produceName: "",
      originFarmId: "",
      originFarmName: "",
      originFarmLocation: "",
      originFarmContactName: "",
      originFarmContactPhone: "",
      available: false,
      cost: "",
      totalQuantityAvailable: "",
      packagingType: "",
      // Page state
      open: false, //  Used to open the edit / add dialog (form)
      uiLoading: true,
      buttonType: "",
      viewOpen: false, //  Used to open the view dialog
      selectedCard: "",
      reloadCards: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);

    this.handleStringSearch = this.handleStringSearch.bind(this);
    this.simpleSearch = this.simpleSearch.bind(this);

    this.populateAllFTags = this.populateAllTags.bind(this);
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

  /** Makes appropriate search by field and query of the data, updates filtered page states */
  simpleSearch = (field, query) => {
    var multiFilteredData = [];
    const parsedQuery = query.toLowerCase();

    switch (field) {
      case "farmNameQuery":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.originFarmName.toLowerCase().includes(parsedQuery)
        );
        break;
      case "produceNameQuery":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.produceName.toLowerCase().includes(parsedQuery)
        );
        break;
      case "originFarmContactNameQuery":
        multiFilteredData = this.state.filteredData.filter((item) =>
          item.originFarmContactName.toLowerCase().includes(parsedQuery)
        );
        break;
    }

    this.setState({ filteredData: multiFilteredData });
  };

  /** Returns additional search features that are collapsed at first glance */
  extraFiltersAccordion = () => {
    const {
      produceNameQuery,
      originFarmContactNameQuery,
      filteredData,
    } = this.state;
    return (
      <div>
        <Grid container spacing={3} alignItem="left">
          <Grid item xs={6}>
            <Autocomplete
              id="produce-search"
              options={filteredData.map((data) => data.produceName)}
              value={produceNameQuery}
              onSelect={(e) => this.handleStringSearch("produceNameQuery", e)}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produce Names"
                  placeholder="Type or Select a Produce Name"
                  variant="outlined"
                  onChange={(e) =>
                    this.handleStringSearch("produceNameQuery", e)
                  }
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
            <Autocomplete
              id="contact-search"
              options={filteredData.map((data) => data.originFarmContactName)}
              value={originFarmContactNameQuery}
              onSelect={(e) =>
                this.handleStringSearch("originFarmContactNameQuery", e)
              }
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Farm Contact Names"
                  placeholder="Type or Select a Farm Contact Name"
                  variant="outlined"
                  onChange={(e) =>
                    this.handleStringSearch("originFarmContactNameQuery", e)
                  }
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
        </Grid>
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
                ...new Set(filteredData.map((data) => data.originFarmName)),
              ]}
              value={nameQuery}
              onSelect={(e) => this.handleStringSearch("farmNameQuery", e)}
              fullWidth={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Foodbank Names"
                  placeholder="Type or Select a Farm Name"
                  variant="outlined"
                  name="farmNameQuery"
                  onChange={(e) => this.handleStringSearch("farmNameQuery", e)}
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
          {this.state.filteredData.map((surplus) => (
            <Grid item xs={12}>
              <Card
                className={classes.root}
                raised={surplus.surplusId === this.state.selectedCard}
                variant={
                  surplus.surplusId === this.state.selectedCard
                    ? "elevation"
                    : "outlined"
                }
              >
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {surplus.totalQuantityAvailable} lbs of{" "}
                    {surplus.produceName} from {surplus.originFarmName}
                  </Typography>
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
                        Logistics:
                      </Typography>
                      <Typography variant="body2" component="p">
                        Origin: {surplus.originFarmName}
                        <br />
                        Packing Type: {surplus.packagingType}
                        <br />
                        Available: {surplus.available ? "yes" : "no"}
                      </Typography>
                    </Box>
                    <Box padding={3}>
                      <Typography
                        className={classes.position}
                        color="textSecondary"
                      >
                        Details:
                      </Typography>
                      <Typography variant="body2" component="p">
                        Type of Produce: {surplus.produceName}
                        <br />
                        Total Quantity Available (lbs):{" "}
                        {surplus.totalQuantityAvailable}
                        <br />
                        Cost (USD / lb): {surplus.cost}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleViewOpen({ surplus })}
                    >
                      View
                    </Button>
                  )}
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleEditClick({ surplus })}
                    >
                      Edit
                    </Button>
                  )}
                  {!this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleDelete({ surplus })}
                    >
                      Delete
                    </Button>
                  )}
                  {this.props.inStepper && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleSelect({ surplus })}
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

  /**
   * Given the name of a state updates the state to a new value provided
   * as a a parameter
   * @param name  Name of the state that will be change
   * @param value New value for the state
   */
  handleAsyncChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  /**
   * Sets states to values so that cards can be reloaded and calls
   * function to reload cards
   */
  reFetch = () => {
    this.setState({
      uiLoading: true,
      reLoadCards: true,
      open: false,
    });
    this.reFetchSurplus();
  };

  /** Returns the authentication token stored in local storage */
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /** Function to refresh the cards in the page without calling window.reload */
  reFetchSurplus = () => {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/surplus")
      .then((response) => {
        this.setState({
          surplusObjects: response.data,
          filteredData: response.data,
          uiLoading: false,
          reloadCards: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.alert("error", "Error reloading in the surplus cards!");
      });
  };

  /** Load in all of the current surplus when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/surplus")
      .then((response) => {
        this.setState({
          surplusObjects: response.data,
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.alert("error", "Error loading in the surplus!");
      });
  }

  /**
   * Takes a surplus object as an input and deletes the given surplus
   * object from the database
   * @param data A surplus object
   */
  handleDelete(data) {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let surplusId = data.surplus.surplusId;
    axios
      .delete(`surplus/${surplusId}`)
      .then(() => {
        this.reFetch();
        this.props.alert("success", "Surplus successfully deleted!");
      })
      .catch((err) => {
        console.error(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Surplus!"
        );
      });
  }

  /** Causes selected card to have hover styling applied */
  handleSelect(data) {
    this.setState({ selectedCard: data.surplus.surplusId });
  }

  /**
   * Takes a surplus object as an input and opens a dialog page to
   * allow the user to update the attributes of the surplus object
   * @param data A surplus object
   */
  handleEditClick(data) {
    this.setState({
      // Surplus states
      surplusId: data.surplus.surplusId,
      produceId: data.surplus.produceId,
      produceName: data.surplus.produceName,
      originFarmId: data.surplus.originFarmId,
      originFarmName: data.surplus.originFarmContactName,
      originaFarmLocation: data.surplus.originFarmLocation,
      originFarmContactName: data.surplus.originFarmContactName,
      originFarmContactPhone: data.surplus.originFarmContactPhone,
      available: data.surplus.available,
      cost: data.surplus.cost,
      totalQuantityAvailable: data.surplus.totalQuantityAvailable,
      packagingType: data.surplus.packagingType,
      // Page states
      buttonType: "Edit",
      open: true,
    });
  }

  /**
   * Takes a surplus object as an input and opens a popup with all the
   * information about the surplus (currently not being used -> will be
   * updated to show augmented information)
   * @param data A surplus object
   */
  handleViewOpen(data) {
    this.setState({
      // Surplus states
      surplusId: data.surplus.surplusId,
      produceId: data.surplus.produceId,
      produceName: data.surplus.produceName,
      originFarmId: data.surplus.originFarmId,
      originFarmName: data.surplus.originFarmContactName,
      originaFarmLocation: data.surplus.originFarmLocation,
      originFarmContactName: data.surplus.originFarmContactName,
      originFarmContactPhone: data.surplus.originFarmContactPhone,
      available: data.surplus.available,
      cost: data.surplus.cost,
      totalQuantityAvailable: data.surplus.totalQuantityAvailable,
      packagingType: data.surplus.packagingType,
      // Page state
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
    const { open, viewOpen } = this.state;

    /** Set all states to generic value when opening a dialog page */
    const handleClickOpen = () => {
      this.setState({
        // Surplus states
        surplusId: "",
        produceId: "",
        produceName: "",
        originFarmId: "",
        originFarmName: "",
        originFarmLocation: "",
        originFarmContactName: "",
        originFarmContactPhone: "",
        available: false,
        cost: "",
        totalQuantityAvailable: "",
        packagingType: "",
        // Page states
        buttonType: "",
        open: true,
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
          {this.state.uiLoading && (
            <CardSkeletons classes={classes} noPadding={this.props.inStepper} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          {this.props.inStepper && (
            <Typography className={(classes.instructions, classes.formText)}>
              Please select a Surplus Object that you would like to pair with a
              Food Bank. If you would like to create a new Surplus Object, press
              addition icon.
            </Typography>
          )}
          <div
            className={!this.props.inStepper ? classes.toolbar : undefined}
          />
          <Fab
            color="primary"
            className={classes.floatingButton}
            aria-label="Add Produce"
            onClick={handleClickOpen}
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
                    ? "Edit Surplus"
                    : "Create a new Surplus"}
                </Typography>
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
              <SurplusStepper
                buttonType={this.state.buttonType}
                alert={this.props.alert}
                farmId={this.state.originFarmId}
                produceId={this.state.produceId}
                surplusId={this.state.surplusId}
                reFetch={this.reFetch}
              />
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
              {this.state.totalQuantityAvailable} lbs of{" "}
              {this.state.produceName} from
              {this.state.originFarmName}
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
                    Logistics:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Origin: {this.state.originFarmName}
                    <br />
                    Packing Type: {this.state.packagingType}
                    <br />
                    Available: {this.state.available ? "yes" : "no"}
                  </Typography>
                </Box>
                <Box padding={3}>
                  <Typography
                    className={classes.position}
                    color="textSecondary"
                  >
                    Details:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Type of Produce: {this.state.produceName}
                    <br />
                    Total Quantity Available (lbs):
                    {this.state.totalQuantityAvailable}
                    <br />
                    Cost (USD / lb): {this.state.cost}
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

export default withStyles(styles)(Surplus);
