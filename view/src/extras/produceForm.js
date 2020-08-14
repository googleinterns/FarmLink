import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";

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
    top: 14,
    right: 10,
  },
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  form: {
    width: "98%",
    marginLeft: 13,
    marginTop: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 470,
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
    height: "32px",
    width: "32px",
    left: "50%",
    top: "35%",
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
  buttons: {
    paddingTop: "24px",
  },
  spacing: {
    marginRight: "8px",
  },
});

/**
 * Represents a Produce component form, which is used to submit new
 * Produce objects or to fetch and edit an individual Produce object
 */
class ProduceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // produce states
      produceObjects: "",
      name: "",
      produceId: "",
      shippingPresetTemperature: "",
      shippingMaintenanceTemperatureLow: "",
      shippingMaintenanceTemperatureHigh: "",
      price: "",
      pricePaid: "",
      amountMoved: "",
      errors: [],
      // page states
      uiLoading: true,
    };
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

  /**
   * If the form is being opened to edit a produce object then load
   * individual produce object when the component has mounted
   */
  componentDidMount() {
    if (this.props.buttonType === "Edit") {
      axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
      axios
        .get(`produce/${this.props.produceId}`)
        .then((response) => {
          this.props.setProduce(response.data);
          this.setState({
            // produce states
            name: response.data.name,
            produceId: response.data.produceId,
            shippingPresetTemperature: response.data.shippingPresetTemperature,
            shippingMaintenanceTemperatureLow:
              response.data.shippingMaintenanceTemperatureLow,
            shippingMaintenanceTemperatureHigh:
              response.data.shippingMaintenanceTemperatureHigh,
            price: response.data.price,
            pricePaid: response.data.pricePaid,
            amountMoved: response.data.amountMoved,
            // page state
            uiLoading: false,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const { errors } = this.state;

    /**
     * Either updates or submits a new produce object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      // go to the next page of the Stepper (parent object)
      this.props.handleNext();
      // submit the new produce object or update the existing one
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newProduce = {
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
      if (this.props.buttonType === "Edit") {
        options = {
          url: `/produce/${this.props.produceId}`,
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
          // send a success alert
          const message =
            this.props.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert(
            "success",
            "Produce has been successfully" + message
          );
        })
        .catch((error) => {
          // send a failure alert
          const message =
            this.props.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " +
              message +
              " the produce!"
          );
          this.setState({ errors: error.response.data });
        });
    };

    // display loading circle if waiting to load in individual produce data
    if (this.state.uiLoading === true && this.props.buttonType === "Edit") {
      return (
        <main className={classes.content}>
          {this.state.uiLoading && (
            <CircularProgress size={150} className={classes.uiProgess} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          <Typography className={classes.instructions}>
            Please press Submit to save a new produce object / save edits. To
            continue without creating / saving the produce object, press Skip.
          </Typography>
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
          {/* The buttons below control the stepper */}
          <div className={classes.buttons}>
            <Button
              disabled={this.props.activeStep === 0}
              onClick={this.props.handleBack}
              className={(classes.button, classes.spacing)}
            >
              Back
            </Button>
            {this.props.isStepOptional(this.props.activeStep) && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.handleSkip}
                className={(classes.button, classes.spacing)}
              >
                Skip
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={(classes.button, classes.spacing)}
            >
              Submit
            </Button>
          </div>
        </main>
      );
    }
  }
}

export default withStyles(styles)(ProduceForm);
