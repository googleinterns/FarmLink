import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import AsyncInput from "../extras/asynchronous";

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
  buttons: {
    paddingTop: "24px",
  },
  spacing: {
    marginRight: "8px",
  },
});

/**
 * Represents a Surplus component form, which is used to submit new
 * Surplus objects or to fetch and edit an individual Surplus object
 */
class ProduceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // surplus states
      originFarmId: "",
      produceId: "",
      available: false,
      cost: "",
      totalQuantityAvailable: "",
      packagingType: "",
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

  /**
   * Given the name of a state and the new value, will update the state
   * to that new value
   * @param name  Name of the state that will be change
   * @param value New value that will be assigned to the state
   */
  handleAsyncChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  /** Returns the authentication token stored in local storage */
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /**
   * If the form is being opened to edit a surplus object then 
   * load individual surplus object when the component has mounted
   */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get(`surplus/${this.props.surplusId}`)
      .then((response) => {
        this.setState({
          // surplus states
          originFarmId: response.data.originFarmId,
          produceId: response.data.produceId,
          available: response.data.available,
          cost: response.data.cost,
          totalQuantityAvailable: response.data.totalQuantityAvailable,
          packagingType: response.data.packagingType,
          // page state
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const { errors } = this.state;

    /**
     * Either updates or submits a new surplus object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      // go to the next page of the Stepper (parent object)
      this.props.handleNext();
      // submit the new surplus object or update the existing one
      event.preventDefault();
      const newSurplus = {
        originFarmId: this.state.originFarmId,
        produceId: this.state.produceId,
        available: this.state.available,
        cost: this.state.cost,
        totalQuantityAvailable: this.state.totalQuantityAvailable,
        packagingType: this.state.packagingType,
      };
      let options = {};
      if (this.props.buttonType === "Edit") {
        options = {
          url: `/surplus/${this.props.surplusId}`,
          method: "put",
          data: newSurplus,
        };
      } else {
        options = {
          url: "/surplus",
          method: "post",
          data: newSurplus,
        };
      }
      axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
      axios(options)
        .then(() => {
          // send a success alert
          const message =
            this.props.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert(
            "success",
            "Surplus has successfully been" + message
          );
          window.location.reload();
        })
        .catch((error) => {
          // send a failure alter
          const message =
            this.props.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " +
              message +
              " the Surplus!"
          );
          this.setState({ errors: error.response.data });
        });
    };

    // display loading circle if waiting to load in individual farm data 
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
          <Container maxWidth="lg">
            <form className={classes.form} noValidate>
              <Grid container spacing={4} allignItems="center">
                <Grid item xs={6}>
                  <AsyncInput
                    history={this.props.history}
                    value={this.props.currentFarm}
                    target="/farms"
                    label="Source Farm"
                    optionSelected={(option, value) =>
                      option.farmName === value.farmName
                    }
                    optionLabel={(option) => option.farmName}
                    handleChange={this.handleAsyncChange}
                    returnValue="originFarmId"
                    paramName="farmId"
                  />
                </Grid>
                <Grid item xs={6}>
                  <AsyncInput
                    history={this.props.history}
                    value={this.props.currentProduce}
                    target="/produce"
                    label="Produce Types"
                    optionSelected={(option, value) =>
                      option.name === value.name
                    }
                    optionLabel={(option) => option.name}
                    handleChange={this.handleAsyncChange}
                    returnValue="produceId"
                    paramName="produceId"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="available-label">Status</InputLabel>
                    <Select
                      value={this.state.available}
                      onChange={this.handleChange}
                      label="Status"
                      inputProps={{
                        name: "available",
                        id: "outlined-available",
                      }}
                    >
                      <MenuItem value={true}>Available</MenuItem>
                      <MenuItem value={false}>Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="cost"
                    label="Cost (per lb)"
                    name="cost"
                    type="number"
                    autoComplete="cost"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    helperText={errors.cost}
                    value={this.state.cost}
                    error={errors.cost ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="totalQuantityAvailable"
                    label="Total Quantity Available"
                    name="totalQuantityAvailable"
                    type="number"
                    autoComplete="totalQuantityAvailable"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">lbs</InputAdornment>
                      ),
                    }}
                    helperText={errors.totalQuantityAvailable}
                    value={this.state.totalQuantityAvailable}
                    error={errors.totalQuantityAvailable ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="packagingType-label">
                      Packaging Type
                    </InputLabel>
                    <Select
                      value={this.state.packagingType}
                      onChange={this.handleChange}
                      label="Packaging Type"
                      inputProps={{
                        name: "packagingType",
                        id: "outlined-packagingType",
                      }}
                    >
                      <MenuItem value="Open Crates">Open Crates</MenuItem>
                      <MenuItem value="Closed Crates">Closed Crates</MenuItem>
                      <MenuItem value="Sacks">Sacks</MenuItem>
                    </Select>
                  </FormControl>
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
              Finish
            </Button>
          </div>
        </main>
      );
    }
  }
}

export default withStyles(styles)(ProduceForm);