import React, { Component } from "react";

import Address from "../extras/address_autocomplete_field";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import axios from "axios";
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
  chip: {
    margin: "4px",
  },
  buttons: {
    paddingTop: "24px",
  },
  spacing: {
    marginRight: "8px",
  },
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
 * Represents a Farm component form, which is used to submit new
 * Farm objects or to fetch and edit an individual farm object
 */
class FarmForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // farm state
      farms: "",
      farmName: "",
      farmId: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "(1  )    -    ",
      farmTags: [],
      forklift: false,
      loadingDock: false,
      location: "",
      locationId: "",
      transportation: false,
      // page state
      errors: [],
      uiLoading: true,
    };

    this.onTagsChange = this.onTagsChange.bind(this);
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

  /** Used to update tags in form */
  onTagsChange = (event, values) => {
    this.setState({
      farmTags: values,
    });
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
  getAuth = () => {
    authMiddleWare(this.props.history);
    return localStorage.getItem("AuthToken");
  };

  /**
   * If the form is being opened to edit a farm then load individual farm
   * when the component has mounted
   */
  componentDidMount() {
    if (this.props.buttonType === "Edit") {
      axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
      axios
        .get(`farms/${this.props.farmId}`)
        .then((response) => {
          this.props.setFarm(response.data);
          this.setState({
            // farm states
            farmName: response.data.farmName,
            farmId: response.data.farmId,
            contactName: response.data.contactName,
            contactEmail: response.data.contactEmail,
            contactPhone: response.data.contactPhone,
            farmTags: response.data.farmTags,
            forklift: response.data.forklift,
            loadingDock: response.data.loadingDock,
            location: response.data.location,
            locationId: response.data.locationId,
            transportation: response.data.transportation,
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
    const { classes } = this.props;
    const { errors } = this.state;

    /**
     * Either updates or submits a new farm object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      // go to the next page of the Stepper (parent object)
      this.props.handleNext();
      // submit the new farm or update the existing farm
      event.preventDefault();
      const newFarm = {
        farmName: this.state.farmName,
        contactName: this.state.contactName,
        contactEmail: this.state.contactEmail,
        contactPhone: this.state.contactPhone,
        farmTags: this.state.farmTags,
        forklift: this.state.forklift,
        loadingDock: this.state.loadingDock,
        location: this.state.location,
        locationId: this.state.locationId,
        transportation: this.state.transportation,
      };
      console.error(newFarm);
      let options = {};
      if (this.props.buttonType === "Edit") {
        options = {
          url: `/farms/${this.props.farmId}`,
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
      axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
      axios(options)
        .then(() => {
          // send a success alert
          const message =
            this.props.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert("success", "Farm has been successfully" + message);
        })
        .catch((error) => {
          // send a failure alert
          const message =
            this.props.buttonType === "Edit" ? " edit" : " submit";
          this.props.alert(
            "error",
            "An error has occured when attempting to " + message + " the farm!"
          );
          this.setState({ errors: error.response.data });
          console.error(error);
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
          <Typography className={classes.instructions}>
            Please press Submit to save a new farm / save edits. To continue
            without creating / saving the farm, press Skip.
          </Typography>
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
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="contactName"
                    label="Point of Contact - Name"
                    name="contactName"
                    type="text"
                    autoComplete="contactName"
                    helperText={errors.contactName}
                    value={this.state.contactName}
                    error={errors.contactName ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel variant="outlined" htmlFor="contactPhone">
                      Point of Contact - Phone
                    </InputLabel>
                    <OutlinedInput
                      label="Point of Contact - Phone"
                      onChange={this.handleChange}
                      name="contactPhone"
                      id="contactPhone"
                      autoComplete="contactName"
                      helperText={errors.contactPhone}
                      value={this.state.contactPhone}
                      error={errors.contactPhone ? true : false}
                      inputComponent={TextMaskCustom}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="contactEmail"
                    label="Point of Contact - Email"
                    name="contactEmail"
                    type="email"
                    autoComplete="contactEmail"
                    helperText={errors.contactEmail}
                    value={this.state.contactEmail}
                    error={errors.contactEmail ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
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
                <Grid item xs={3}>
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
                <Grid item xs={3}>
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
                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id="farmTags"
                    onChange={this.onTagsChange}
                    options={this.state.farmTags.map((option) => option.title)} // need to create agregated tags array
                    // defaultValue={[top100Films[].title]}
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

export default withStyles(styles)(FarmForm);
