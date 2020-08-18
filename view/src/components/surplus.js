import React, { Component } from "react";
import CardSkeletons from "../extras/skeleton";
import SurplusStepper from "../extras/surplusStepper";

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
    width: "98%",
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
  pos: {
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
});

// Used as a placeholder since the CustomTable isn't connected to CRUD
const tableData = {
  columns: [
    { title: "Role", field: "contactRole" },
    { title: "Name", field: "contactName" },
    { title: "Email", field: "contactEmail" },
    { title: "Phone Number", field: "contactPhone" },
  ],
  data: [
    {
      contactRole: "Farm Manager",
      contactName: "Jane Doe",
      contactEmail: "jane@doe.com",
      contactPhone: "(777)851-1234",
    },
  ],
};

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
      // surplus state
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
      // page state
      errors: [],
      open: false, // use to open the edit / add dialog (form)
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
      selectedCard: "",
      reloadCards: false, // used to open the view dialgo
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);
  }

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
    console.error(name);
    console.error(value);
    this.setState({
      [name]: value,
    });
  };

  /** Sets states to values so that cards can be reloaded and calls function to reload cards */
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
          uiLoading: false,
          reloadCards: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /** Load in all of the current food banks when the component has mounted */
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
        //window.location.reload();
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
      // surplus states
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
      // page states
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
      // surplus states
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
      // page state
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

    /** Set all states to generic value when opening a dialog page */
    const handleClickOpen = () => {
      this.setState({
        // surplus states
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
        // page states
        buttonType: "",
        open: true,
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
            <CardSkeletons classes={classes} noPadding={!this.props.main} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          {/* Only show if it is not the main page */}
          {!this.props.main && (
            <Typography className={(classes.instructions, classes.formText)}>
              Please select a Surplus Object that you would like to pair with a
              Food Bank. If you would like to create a new Surplus Object, press
              the icon in the bottom right.
            </Typography>
          )}
          <div className={this.props.main ? classes.toolbar : undefined} />
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
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    fullWidth={true}
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
              </Grid>
              {this.state.surplusObjects.map((surplus) => (
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
                        p={0}
                        m={0}
                      >
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            Logistics:
                          </Typography>
                          <Typography variant="body2" component="p">
                            Origin: {surplus.originFarmName} (link with card +
                            info)
                            <br />
                            Packing Type: {surplus.packagingType}
                            <br />
                            Available: {surplus.available ? "yes" : "no"}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
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
                      {/* Only show if it is main page */}
                      {this.props.main && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.handleViewOpen({ surplus })}
                        >
                          View
                        </Button>
                      )}
                      {this.props.main && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.handleEditClick({ surplus })}
                        >
                          Edit
                        </Button>
                      )}
                      {this.props.main && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.handleDelete({ surplus })}
                        >
                          Delete
                        </Button>
                      )}
                      {/* Only show if it is not the main page */}
                      {!this.props.main && (
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
                p={0}
                m={0}
              >
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
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
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
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
