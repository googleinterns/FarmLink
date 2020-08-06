import React, { Component } from "react";

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
// import { fade } from '@material-ui/core/styles';
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
    bottom: 16,
    right: 16,
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
    // '&:hover': {
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
    //transition: theme.transitions.create('width'),
    width: "100%",
    // [theme.breakpoints.up('sm')]: {
    // width: '100ch',
    // '&:focus': {
    //     width: '100ch',
    // },
    // },
  },
  chip: {
    margin: "4px",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

class foodbank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodbanks: "",
      foodbankName: "",
      location: "",
      locationId: "",
      hours: "",
      foodbankId: "",
      contactPhone: "(1  )    -    ",
      contactName: "",
      contactEmail: "",
      forklift: false,
      pallet: false,
      loadingDock: false,
      maxLoadSize: "",
      refrigerationSpaceAvailable: "",
      foodbankTags: [],
      errors: [],
      open: false,
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
    };

    this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
    this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChecked = (name) => (event) => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  onTagsChange = (event, values) => {
    this.setState(
      {
        foodbankTags: values,
      },
      () => {
        // This will output an array of objects
        // given by Autocompelte options property.
        console.log(this.state.foodbankeTags);
      }
    );
  };

  handleLocation = (newValue) => {
    if (newValue === null) {
      return;
    }
    this.setState({
      location: newValue.description,
      locationId: newValue.place_id,
    });
  };

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/foodbanks")
      .then((response) => {
        this.setState({
          foodbanks: response.data,
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteTodoHandler(data) {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let foodbankId = data.foodbank.foodbankId;
    axios
      .delete(`foodbanks/${foodbankId}`)
      .then(() => {
        window.location.reload();
        this.props.alert("success", "Food Bank successfully deleted!");
      })
      .catch((err) => {
        console.log(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Food Bank!"
        );
      });
  }

  handleEditClickOpen(data) {
    this.setState({
      foodbankName: data.foodbank.foodbankName,
      location: data.foodbank.location,
      locationId: data.foodbank.locationId,
      hours: data.foodbank.hours,
      foodbankId: data.foodbank.foodbankId,
      contactPhone: data.foodbank.contactPhone,
      contactName: data.foodbank.contactName,
      contactEmail: data.foodbank.contactEmail,
      forklift: data.foodbank.forklift,
      pallet: data.foodbank.pallet,
      loadingDock: data.foodbank.loadingDock,
      maxLoadSize: data.foodbank.maxLoadSize,
      refrigerationSpaceAvailable: data.foodbank.refrigerationSpaceAvailable,
      foodbankTags: data.foodbank.foodbankTags,
      buttonType: "Edit",
      open: true,
    });
  }

  handleViewOpen(data) {
    this.setState({
      foodbankName: data.foodbank.foodbankName,
      location: data.foodbank.location,
      locationId: data.foodbank.locationId,
      hours: data.foodbank.hours,
      contactPhone: data.foodbank.contactPhone,
      contactName: data.foodbank.contactName,
      contactEmail: data.foodbank.contactEmail,
      forklift: data.foodbank.forklift,
      pallet: data.foodbank.pallet,
      loadingDock: data.foodbank.loadingDock,
      maxLoadSize: data.foodbank.maxLoadSize,
      refrigerationSpaceAvailable: data.foodbank.refrigerationSpaceAvailable,
      foodbankTags: data.foodbank.foodbankTags,
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

    const handleClickOpen = () => {
      this.setState({
        foodbankName: "",
        location: "",
        locationId: "",
        hours: "",
        foodbankId: "",
        contactPhone: "(1  )    -    ",
        contactName: "",
        contactEmail: "",
        forklift: false,
        pallet: false,
        loadingDock: false,
        maxLoadSize: "",
        refrigerationSpaceAvailable: "",
        foodbankTags: [],
        open: true,
      });
    };

    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newFoodBank = {
        foodbankName: this.state.foodbankName,
        location: this.state.location,
        locationId: this.state.locationId,
        hours: this.state.hours,
        contactPhone: this.state.contactPhone,
        contactName: this.state.contactName,
        contactEmail: this.state.contactEmail,
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
          this.setState({ open: false });
          const message =
            this.state.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert(
            "success",
            "Food Bank has been successfully" + message
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
              " the Food Bank!"
          );
          this.setState({ open: true, errors: error.response.data });
          console.log(error);
        });
    };

    const handleViewClose = () => {
      this.setState({ viewOpen: false });
    };

    const handleClose = (event) => {
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
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
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
                <Grid container spacing={4} allignItems="center">
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
                    />
                    {/* can we get the hours from the location query? */}
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
                        value={this.state.contactPhone}
                        onChange={this.handleChange}
                        helperText={errors.contactPhone}
                        error={errors.contactPhone ? true : false}
                        name="contactPhone"
                        id="contactPhone"
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
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Loading Dock Present
                      </InputLabel>
                      <Select
                        value={this.state.loadingDock}
                        onChange={this.handleChange}
                        label="Loading Dock Present"
                        inputProps={{
                          name: "loadingDock",
                          id: "outlined-age-native-simple",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Forklift Present
                      </InputLabel>
                      <Select
                        value={this.state.forklift}
                        onChange={this.handleChange}
                        label="Forklift Present"
                        inputProps={{
                          name: "forklift",
                          id: "outlined-age-native-simple",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Pallet Present
                      </InputLabel>
                      <Select
                        value={this.state.pallet}
                        onChange={this.handleChange}
                        label="Pallet Present"
                        inputProps={{
                          name: "pallet",
                          id: "outlined-age-native-simple",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
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
                  <Grid item xs={3}>
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
                      options={tagExamples.map((option) => option.title)} // need to create agregated tags array
                      // defaultValue={[top100Films[].title]}
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
                          label="Food Banks Tags"
                          placeholder="tags..."
                        />
                      )}
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
              {this.state.foodbanks.map((foodbank) => (
                <Grid item xs={12}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {/* Los Angeles Regional Food Bank */}
                        {foodbank.foodbankName}
                      </Typography>
                      <Chip
                        className={classes.chip}
                        label="High Food Insecurity"
                        size="small"
                      />
                      <Chip
                        className={classes.chip}
                        label="Major City"
                        size="small"
                      />
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
                            Details:
                          </Typography>
                          <Typography variant="body2" component="p">
                            Location of Food Bank:{" "}
                            {`${foodbank.location.substring(0, 30)}`}
                            <br />
                            {`${foodbank.location.substring(30, 78)}`}
                            Regrigeration Space (in pallets):{" "}
                            {foodbank.refrigerationSpaceAvailable}
                            <br />
                            Max Load Size (in pallets): {foodbank.maxLoadSize}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            Point of Contact:
                          </Typography>
                          <Typography variant="body2" component="p">
                            Name: {foodbank.contactName}
                            <br />
                            Phone: {foodbank.contactPhone}
                            <br />
                            Email: {foodbank.contactEmail}
                          </Typography>
                        </Box>
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
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
                        <Box p={3}>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            Hours of Operation:
                          </Typography>
                          <Typography variant="body2" component="p">
                            Monday-Friday: 9am - 5pm
                            <br />
                            Saturday: 10am - 4pm
                            <br />
                            Sunday: closed
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleViewOpen({ foodbank })}
                      >
                        {" "}
                        View{" "}
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleEditClickOpen({ foodbank })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.deleteTodoHandler({ foodbank })}
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
            classes={{ paperFullWidth: classes.dialogeStyle }}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
              {/* Los Angeles Regional Food Bank */}
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
                p={0}
                m={0}
              >
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
                    Details:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Location of Food Bank:{" "}
                    {`${this.state.location.substring(0, 30)}`}
                    <br />
                    {`${this.state.location.substring(30, 78)}`}
                    Regrigeration Space (in pallets):{" "}
                    {this.state.refrigerationSpaceAvailable}
                    <br />
                    Max Load Size (in pallets): {this.state.maxLoadSize}
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
                    Point of Contact:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Name: {this.state.contactName}
                    <br />
                    Phone: {this.state.contactPhone}
                    <br />
                    Email: {this.state.contactEmail}
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
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
                <Box p={3}>
                  <Typography className={classes.pos} color="textSecondary">
                    Hours of Operation:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Monday-Friday: 9am - 5pm
                    <br />
                    Saturday: 10am - 4pm
                    <br />
                    Sunday: closed
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

const farmsExamples = [
  { title: "Borden Farms", id: 0 },
  { title: "San Cristobal Apple Orchars", id: 1 },
  { title: "Taylor Farms", id: 2 },
];

const tagExamples = [
  { title: "High Food Insecurity" },
  { title: "Major City" },
];

export default withStyles(styles)(foodbank);
