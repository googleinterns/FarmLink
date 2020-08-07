import React, { Component } from "react";

import Address from "../extras/address";
import CardSkeletons from "../extras/skeleton";
import CustomTable from "../extras/table";

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

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

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
  table: {
    marginTop: "48px",
  },
});

const tableState = {
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

// const tableFormat = [
//   { title: "Role", field: "contactRole" },
//   { title: "Name", field: "contactName" },
//   { title: "Email", field: "contactEmail" },
//   { title: "Phone Number", field: "contactPhone" },
// ]

// const tableData = [{
//   contactRole: "Farm Manager",
//   contactName: "Jane Doe",
//   contactEmail: "jane@doe.com",
//   contactPhone: "(777)851-1234",
// },]

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

class farms extends Component {
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
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
    };

    this.onTagsChange = this.onTagsChange.bind(this);
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
        farmTags: values,
      },
      () => {
        // This will output an array of objects
        // given by Autocompelte options property.
        console.log(this.state.farmTags);
      }
    );
  };

  handleLocation = (newValue) => {
    if (newValue === null) {
      return;
    }
    console.log(newValue);
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
      .get("/farms")
      .then((response) => {
        this.setState({
          farms: response.data,
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
    let farmId = data.farm.farmId;
    console.log(farmId);
    axios
      .delete(`farms/${farmId}`)
      .then(() => {
        window.location.reload();
        this.props.alert("success", "Farm successfully deleted!");
      })
      .catch((err) => {
        console.log(err);
        this.props.alert(
          "error",
          "An error occurred when attempting to delete the Farm!"
        );
      });
  }

  handleEditClickOpen(data) {
    this.setState({
      farmName: data.farm.farmName,
      farmId: data.farm.farmId,
      contactName: data.farm.contactName,
      contactEmail: data.farm.contactEmail,
      contactPhone: data.farm.contactPhone,
      farmTags: data.farm.farmTags,
      forklift: data.farm.forklift,
      loadingDock: data.farm.loadingDock,
      location: data.farm.location,
      locationId: data.farm.locationId,
      transportation: data.farm.transportation,
      buttonType: "Edit",
      open: true,
    });
  }

  handleViewOpen(data) {
    this.setState({
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
        open: true,
      });
    };

    const handleSubmit = (event) => {
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
          const message =
            this.state.buttonType === "Edit" ? " edited!" : " submitted!";
          this.props.alert("success", "Farm has been successfully" + message);
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
                      options={tagExamples.map((option) => option.title)} // need to create agregated tags array
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
                <div className={classes.table}>
                  <CustomTable title="Farms Contacts" tableState={tableState} />
                </div>
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
              {this.state.farms.map((farm) => (
                <Grid item xs={12}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {farm.farmName}
                      </Typography>
                      {farm.farmTags.map((tag) => (
                        <Chip
                          className={classes.chip}
                          label={tag}
                          size="small"
                        />
                      ))}
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
                            Location of Farm:{" "}
                            {`${farm.location.substring(0, 30)}`}
                            <br />
                            {`${farm.location.substring(30, 78)}`}
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
                            Name: {farm.contactName}
                            <br />
                            Phone: {farm.contactPhone}
                            <br />
                            Email: {farm.contactEmail}
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
                            Have Transportation Means:{" "}
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
                      {/* <Button size="small" color="primary" onClick={() => this.handleViewOpen({ farm })}>
                                                {" "}
                                                View{" "}
                                            </Button> */}
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleEditClickOpen({ farm })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.deleteTodoHandler({ farm })}
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
              {this.state.farmName}
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
                    Details:
                  </Typography>
                  <Typography variant="body2" component="p">
                    Location of Farm: {this.state.location}
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
                    Have Transportation Means:{" "}
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

const farmsExamples = [
  { title: "Borden Farms", id: 0 },
  { title: "San Cristobal Apple Orchars", id: 1 },
  { title: "Taylor Farms", id: 2 },
];

const tagExamples = [
  { title: "Black Owned" },
  { title: "Great Environmental Rating" },
];

export default withStyles(styles)(farms);
