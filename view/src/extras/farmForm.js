import React, { Component, forwardRef, useImperativeHandle } from "react";

import Address from "../extras/address";
import CardSkeletons from "../extras/skeleton";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import InputBase from "@material-ui/core/InputBase";
import Chip from "@material-ui/core/Chip";
// import { fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Alert from "../extras/alert";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import OutlinedInput from "@material-ui/core/OutlinedInput";

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
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  dialogeStyle: {
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
    // backgroundColor: fade(theme.palette.primary.main, 0.15),
    // "&:hover": {
    // backgroundColor: fade(theme.palette.primary.main, 0.25),
    // },
    // //backgroundColor: theme.palette.primary.main,
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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    //transition: theme.transitions.create("width"),
    width: "100%",
    // [theme.breakpoints.up("sm")]: {
    // width: "100ch",
    // "&:focus": {
    //     width: "100ch",
    // },
    // },
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

class FarmForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      errors: [],
      open: false,
      alert: false,
      uiLoading: true,
      viewOpen: false,
    };

    this.onTagsChange = this.onTagsChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // toSubmit = (this.props, ref) => {
  //     forwardRef((this.props, ref) => {
  //       useImperativeAHandle(ref, () => ({
  //           handleSubmit();
  //       }));
  //   });
  //   }

  onTagsChange = (event, values) => {
    this.setState(
      {
        farmTags: values,
      },
      () => {
        // This will output an array of objects
        // given by Autocompelte options property.
        //console.log(this.state.farmTags);
      }
    );
  };

  handleLocation = (newValue) => {
    if (newValue === null) {
      return;
    }
    //console.log(newValue);
    this.setState({
      location: newValue.description,
      locationId: newValue.place_id,
    });
  };

  // will get one farm and render it into edit form

  componentWillMount = () => {
    if (this.props.buttonType === "Edit") {
      authMiddleWare(this.props.history);
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios
        .get(`farms/${this.props.farmId}`)
        .then((response) => {
          this.setState({
            // farms: response.data,
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
            uiLoading: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { open, errors, viewOpen } = this.state;

    const handleSubmit = (event) => {
      this.props.handleNext();
      authMiddleWare(this.props.history);
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
      console.log(newFarm);
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
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          //this.setState({ open: false });
          console.log("woop woop");
          this.props.openAlert();
          //window.location.reload();
        })
        .catch((error) => {
          this.setState({ open: true, errors: error.response.data });
          console.log(error);
        });
    };

    console.log("WE ARE INSIDE THE MAIN FRAME");
    console.log(this.props.toSubmit);
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
          <Alert
            open={this.state.alert}
            handleOpen={this.openAlert}
            handleClose={this.closeAlert}
          />
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
