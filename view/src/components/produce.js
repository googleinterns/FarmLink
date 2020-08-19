import React, { Component } from "react";
import CardSkeletons from "../extras/skeleton";

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
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";

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
  pos: {
    marginBottom: 12,
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
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
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This class represents a Produce component, which is a sub-page of the
 * home page where produce objects are visualized, created, updated, edited,
 * and deleted.
 */
class Produce extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Produce states
      produceObjects: "",
      name: "",
      produceId: "",
      shippingPresetTemperature: "",
      shippingMaintenanceTemperatureLow: "",
      shippingMaintenanceTemperatureHigh: "",
      price: "",
      pricePaid: "",
      amountMoved: "",
      // Page states
      errors: [],
      open: false,
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
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

  /** Returns the authentication token stored in local storage */
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /** Load in all of the current todos when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/produce")
      .then((response) => {
        this.setState({
          produceObjects: response.data,
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Takes a produce object as an input and deletes the given produce
   * object from the database
   * @param data A produce object
   */
  handleDelete(data) {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    let produceId = data.produce.produceId;
    axios
      .delete(`produce/${produceId}`)
      .then(() => {
        window.location.reload();
        this.props.alert("success", "Produce successfully deleted!");
      })
      .catch((err) => {
        console.error(err);
        console.log(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Produce!"
        );
      });
  }

  /**
   * Takes a produce object as an input and opens a dialog page to
   * allow the user to update the attributes of the produce object
   * @param data A produce object
   */
  handleEditClick(data) {
    this.setState({
      // Produce states
      name: data.produce.name,
      produceId: data.produce.produceId,
      shippingPresetTemperature: data.produce.shippingPresetTemperature,
      shippingMaintenanceTemperatureLow:
        data.produce.shippingMaintenanceTemperatureLow,
      shippingMaintenanceTemperatureHigh:
        data.produce.shippingMaintenanceTemperatureHigh,
      amountMoved: data.produce.amountMoved,
      price: data.produce.price,
      pricePaid: data.produce.pricePaid,
      // Page states
      buttonType: "Edit",
      open: true,
    });
  }

  /**
   * Takes a produce object as an input and opens a popup with all the
   * information about the produce (currently not being used -> will be
   * updated to show augmented information)
   * @param data A produce object
   */
  handleViewOpen(data) {
    this.setState({
      // Produce states
      name: data.produce.name,
      shippingPresetTemperature: data.produce.shippingPresetTemperature,
      shippingMaintenanceTemperatureLow:
        data.produce.shippingMaintenanceTemperatureLow,
      shippingMaintenanceTemperatureHigh:
        data.produce.shippingMaintenanceTemperatureHigh,
      amountMoved: data.produce.amountMoved,
      price: data.produce.price,
      pricePaid: data.produce.pricePaid,
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
    const { open, errors, viewOpen } = this.state;

    /** Set states related to dialogue to generic value when opening */
    const handleAddClick = () => {
      this.setState({
        // Produce states
        name: "",
        produceId: "",
        shippingPresetTemperature: 0,
        shippingMaintenanceTemperatureLow: "",
        shippingMaintenanceTemperatureHigh: "",
        price: "",
        pricePaid: "",
        amountMoved: "",
        // Page states
        buttonType: "",
        open: true,
      });
    };

    /**
     * Either updates or submits a new produce object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newProduce = {
        // Farm states
        name: this.state.name,
        shippingPresetTemperature: parseFloat(
          this.state.shippingPresetTemperature
        ),
        shippingMaintenanceTemperatureLow: parseFloat(
          this.state.shippingMaintenanceTemperatureLow
        ),
        shippingMaintenanceTemperatureHigh: parseFloat(
          this.state.shippingMaintenanceTemperatureHigh
        ),
        price: parseFloat(this.state.price),
        pricePaid: parseFloat(this.state.pricePaid),
        amountMoved: parseFloat(this.state.amountMoved),
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/produce/${this.state.produceId}`,
          method: "put",
          data: newProduce,
        };
      } else {
        options = {
          url: "/produce",
          method: "post",
          data: newProduce,
        };
      }
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          // Page state
          this.setState({ open: false });
          const message =
            this.state.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert(
            "success",
            "Produce has been successfully" + message
          );
          window.location.reload();
        })
        .catch((error) => {
          const message =
            this.state.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " +
              message +
              " the produce!"
          );
          // Page states
          this.setState({ open: true, errors: error.response.data });
        });
    };

    const handleViewClose = () => {
      // Page state (for view modal)
      this.setState({ viewOpen: false });
    };

    const handleDialogClose = (event) => {
      // Page state (for dialog)
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
                    ? "Edit Produce"
                    : "Create a new Produce"}
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
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="produceName"
                      label="Produce Name"
                      name="name"
                      autoComplete="produceName"
                      helperText={errors.name}
                      value={this.state.name}
                      error={errors.name ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="amountMoved"
                      label="Amount Moved"
                      name="amountMoved"
                      autoComplete="amountMoved"
                      defaultValue="0"
                      helperText={errors.amountMoved}
                      value={this.state.amountMoved}
                      error={errors.amountMoved ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="price"
                      label="USDA Price"
                      name="price"
                      type="number"
                      autoComplete="price"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      helperText={errors.price}
                      value={this.state.price}
                      error={errors.price ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="pricePaid"
                      label="Average Price Paid"
                      name="pricePaid"
                      type="number"
                      autoComplete="pricePaid"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      helperText={errors.pricePaid}
                      value={this.state.pricePaid}
                      error={errors.pricePaid ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="shippingMaintenanceTemperatureLow"
                      label="Shipping Maintenance Temperature Low"
                      name="shippingMaintenanceTemperatureLow"
                      type="number"
                      autoComplete="shippingMaintenanceTemperatureLow"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°F</InputAdornment>
                        ),
                      }}
                      helperText={errors.shippingMaintenanceTemperatureLow}
                      value={this.state.shippingMaintenanceTemperatureLow}
                      error={
                        errors.shippingMaintenanceTemperatureLow ? true : false
                      }
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="shippingMaintenanceTemperatureHigh"
                      label="Shipping Maintenance Temperature High"
                      name="shippingMaintenanceTemperatureHigh"
                      type="number"
                      autoComplete="shippingMaintenanceTemperatureHigh"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°F</InputAdornment>
                        ),
                      }}
                      helperText={errors.shippingMaintenanceTemperatureHigh}
                      value={this.state.shippingMaintenanceTemperatureHigh}
                      error={
                        errors.shippingMaintenanceTemperatureHigh ? true : false
                      }
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="shippingPresetTemperature"
                      label="Shipping Preset Temperature"
                      name="shippingPresetTemperature"
                      type="number"
                      autoComplete="shippingPresetTemperature"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°F</InputAdornment>
                        ),
                      }}
                      helperText={errors.shippingPresetTemperature}
                      value={this.state.shippingPresetTemperature}
                      error={errors.shippingPresetTemperature ? true : false}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
              </form>
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
              {this.state.produceObjects.map((produce) => (
                <Grid item xs={12}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {produce.name}
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
                            Shipping Temperatures in Reefer (°F):
                          </Typography>
                          <Typography variant="body2" component="p">
                            Maintenance Temperature:
                            {produce.shippingMaintenanceTemperatureLow} -
                            {produce.shippingMaintenanceTemperatureHigh}
                            <br />
                            Preset Temperature:
                            {produce.shippingPresetTemperature}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            Pricing (in USD / lb):
                          </Typography>
                          <Typography variant="body2" component="p">
                            USDA Price: ${produce.price}
                            <br />
                            Average Price Paid by Farmlink: ${produce.pricePaid}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            Internal Statistics:
                          </Typography>
                          <Typography variant="body2" component="p">
                            Amount Moved by FarmLink (lbs):
                            {produce.amountMoved}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleViewOpen({ produce })}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleEditClick({ produce })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleDelete({ produce })}
                      >
                        Delete
                      </Button>
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
              {this.state.name}
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
                    Shipping Temperatures in Reefer (°F):
                  </Typography>
                  <Typography variant="body2" component="p">
                    Maintenance Temperature:
                    {this.state.shippingMaintenanceTemperatureLow} -
                    {this.state.shippingMaintenanceTemperatureHigh}
                    <br />
                    Preset Temperature: {this.state.shippingPresetTemperature}
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
                    Pricing (in USD / lb):
                  </Typography>
                  <Typography variant="body2" component="p">
                    USDA Price: ${this.state.price}
                    <br />
                    Average Price Paid by Farmlink: ${this.state.pricePaid}
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
                    Internal Statistics:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Amount Moved by FarmLink (lbs): {this.state.amountMoved}
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

export default withStyles(styles)(Produce);
