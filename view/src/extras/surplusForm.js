import React, { Component } from "react";

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
// import { fade } from '@material-ui/core/styles';
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
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
  buttons: {
    paddingTop: "24px",
  },
  spacing: {
    marginRight: "8px",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ProduceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      available: "",
      cost: "",
      originFarm: "",
      packagingType: "",
      produceId: "",
      totalQuantityAvailable: "",
      errors: [],
      open: false,
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
    };

    // this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleAsyncChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  // componentWillMount = () => {
  //   authMiddleWare(this.props.history);
  //   const authToken = localStorage.getItem("AuthToken");
  //   axios.defaults.headers.common = { Authorization: `${authToken}` };
  //   axios
  //     .get("/produce")
  //     .then((response) => {
  //       this.setState({
  //         produceObjects: response.data,
  //         uiLoading: false,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  //   handleEditClickOpen(data) {
  //     this.setState({
  //       name: data.produce.name,
  //       produceId: data.produce.produceId,
  //       shippingPresetTemperature: data.produce.shippingPresetTemperature,
  //       shippingMaintenanceTemperatureLow:
  //         data.produce.shippingMaintenanceTemperatureLow,
  //       shippingMaintenanceTemperatureHigh:
  //         data.produce.shippingMaintenanceTemperatureHigh,
  //       amountMoved: data.produce.amountMoved,
  //       price: data.produce.price,
  //       pricePaid: data.produce.pricePaid,
  //       buttonType: "Edit",
  //       open: true,
  //     });
  //   }

  render() {
    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const { open, errors, viewOpen } = this.state;

    const handleClickOpen = () => {
      this.setState({
        available: "",
        cost: "",
        originFarm: "",
        packagingType: "",
        produceId: "",
        totalQuantityAvailable: "",
        open: true,
      });
    };

    const handleSubmit = (event) => {
      this.props.handleNext();
      authMiddleWare(this.props.history);
      event.preventDefault();
      const newSurplus = {
        available: this.state.available,
        cost: this.state.cost,
        originFarm: this.state.originFarm,
        packagingType: this.state.packagingType,
        produceId: this.state.produceId,
        totalQuantityAvailable: this.state.totalQuantityAvailable,
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/surplus/${this.state.surplusId}`,
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
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          this.setState({ open: false });
          //this.setState({ alert: true })
          //window.location.reload();
        })
        .catch((error) => {
          this.setState({ open: true, errors: error.response.data });
          //   console.log(newProduce);
        });
    };

    return (
      <main className={classes.content}>
        <Container maxWidth="lg">
          <form className={classes.form} noValidate>
            <Grid container spacing={4} allignItems="center">
              <Grid item xs={6}>
                {/* comment out ->               <Autocomplete
                      id="originFarm"
                      options={this.state.farms}
                      getOptionLabel={(farm) => farm.farmName}
                      onChange={(event, newValue) => {
                        //setOptions(newValue ? [newValue, ...options] : options);
                        //setValue(newValue);
                        console.log(newValue.farmId);
                        // console.log(newValue);
                      }}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Origin Farm"
                          variant="outlined"
                        />
                      )}
                    />  */}
                <AsyncInput
                  history={this.props.history}
                  target="/farms"
                  label="Source Farm"
                  optionSelected={(option, value) =>
                    option.farmName === value.farmName
                  }
                  optionLabel={(option) => option.farmName}
                  handleChange={this.handleAsyncChange}
                  returnValue="farmId"
                />
              </Grid>
              <Grid item xs={6}>
                <AsyncInput
                  history={this.props.history}
                  target="/produce"
                  label="Produce Types"
                  optionSelected={(option, value) => option.name === value.name}
                  optionLabel={(option) => option.name}
                  handleChange={this.handleAsyncChange}
                  returnValue="produceId"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="available-label">Status</InputLabel>
                  <Select
                    labelId="available-outlined-label"
                    id="available"
                    // value={age}
                    onChange={this.handleChange}
                    label="Status"
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
                  // helperText={errors.title}
                  // value={this.state.title}
                  // error={errors.title ? true : false}
                  // onChange={this.handleChange}
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
                  // helperText={errors.title}
                  // value={this.state.title}
                  // error={errors.title ? true : false}
                  // onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="packagingType-label">
                    Packaging Type
                  </InputLabel>
                  <Select
                    labelId="packagingType-outlined-label"
                    id="packagingType"
                    // value={age}
                    onChange={this.handleChange}
                    label="Packaging Type"
                  >
                    <MenuItem value="Open Crates">Open Crates</MenuItem>
                    <MenuItem value="Closed Crates">Closed Crates</MenuItem>
                    <MenuItem value="Sacks">Sacks</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* comment out ->           <div className={classes.table}>
                  <CustomTable
                    title="Operating Hours"
                    data={tableData}
                  />
                </div>  */}
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
            Finish
          </Button>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(ProduceForm);
