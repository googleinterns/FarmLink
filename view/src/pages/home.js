// home.js

import React, { Component } from "react";
import axios from "axios";

import Account from "../components/account";
import Deal from "../components/deal";
import Produce from "../components/produce";
import Surplus from "../components/surplus";
import Farms from "../components/farms";
import FoodBanks from "../components/foodbanks";
import Alert from "../extras/alert";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
// import NotesIcon from '@material-ui/icons/Notes';
import NatureIcon from "@material-ui/icons/LocalFlorist";
import BankIcon from "@material-ui/icons/HomeWork";
import DealIcon from "@material-ui/icons/Telegram";
import ChartIcon from "@material-ui/icons/ShowChart";
import EcoIcon from "@material-ui/icons/Eco";
import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CircularProgress from "@material-ui/core/CircularProgress";

import { authMiddleWare } from "../util/auth";

const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  contentContainer: {
    width: "80%",
  },
  avatar: {
    height: 64,
    width: 64,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  toolbar: theme.mixins.toolbar,
  selected: {
    color: theme.palette.primary.white,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.dark,
    },
  },
});

class home extends Component {
  // state = {
  //   toRender: "deals",
  //   showAlert: false,
  //   severity: "",
  //   message: "",
  // };

  openAlert = () => {
    localStorage.setItem("showAlert", "true");
    this.setState({ showAlert: true });
  };

  closeAlert = () => {
    localStorage.setItem("showAlert", "false");
    this.setState({ showAlert: false });
  };

  alert = (newSeverity, newMessage) => {
    localStorage.setItem("severity", newSeverity);
    localStorage.setItem("message", newMessage);
    this.setState({
      severity: newSeverity,
      message: newMessage,
    });
    //console.log(newSeverity);
    this.openAlert();
  };

  getStorage = (name, standardVal) => {
    console.log("to storage 3.0");
    const storedContent = localStorage.getItem(name) || standardVal;
    console.log(storedContent);

    //console.log(JSON.parse({"test":"test"}));

    return {
      storedContent,
    };
  };

  saveStateToLocalStorage = () => {
    console.log("to storage");
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  };

  loadAccountPage = (event) => {
    localStorage.setItem("toRender", "account");
    this.setState({ toRender: "account" });
  };

  loadTodoPage = (event) => {
    localStorage.setItem("toRender", "deals");
    this.setState({ toRender: "deals" });
  };

  loadProducePage = (event) => {
    localStorage.setItem("toRender", "produce");
    this.setState({ toRender: "produce" });
  };

  loadSurplusPage = (event) => {
    localStorage.setItem("toRender", "surplus");
    this.setState({ toRender: "surplus" });
  };

  loadFarmsPage = (event) => {
    localStorage.setItem("toRender", "farms");
    this.setState({ toRender: "farms" });
  };

  loadFoodBanksPage = (event) => {
    localStorage.setItem("toRender", "foodbanks");
    this.setState({ toRender: "foodbanks" });
  };

  logoutHandler = (event) => {
    localStorage.removeItem("AuthToken");
    this.props.history.push("/login");
  };

  isSelected = (name) => {
    return this.state.toRender === name;
  };

  constructor(props) {
    super(props);

    this.state = {
      toRender: this.getStorage("toRender", "deals")["storedContent"],
      showAlert:
        this.getStorage("showAlert", "false")["storedContent"] === "true",
      // toRender: JSON.parse(localStorage).getItem("toRender") || "deals",
      // showAlert: JSON.parse(localStorage).getItem("showAlert") || false,
      // toRender: "deals",
      // showAlert: false,
      severity: this.getStorage("severity", "")["storedContent"],
      message: this.getStorage("message", "")["storedContent"],
      firstName: "",
      lastName: "",
      profilePicture: "",
      uiLoading: true,
      imageLoading: false,
    };
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/user")
      .then((response) => {
        console.log(this.state);
        this.setState({
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username,
          uiLoading: false,
          profilePicture: response.data.userCredentials.imageUrl,
        });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.props.history.push("/login");
        }
        console.log(error);
        this.setState({ errorMsg: "Error in retrieving the data" });
      });
  };

  render() {
    const { classes } = this.props;
    if (this.state.uiLoading === true) {
      return (
        <div className={classes.root}>
          {this.state.uiLoading && (
            <CircularProgress size={150} className={classes.uiProgess} />
          )}
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar} color="primary">
            <Toolbar>
              <Typography variant="h6" noWrap>
                The FarmLink Project
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <Divider />
            <center>
              <Avatar
                src={this.state.profilePicture}
                className={classes.avatar}
              />
              <p>
                {" "}
                {this.state.firstName} {this.state.lastName}
              </p>
            </center>
            <Divider />
            <List>
              <ListItem
                button
                className={this.isSelected("farms") && classes.selected}
                key="Farms"
                onClick={this.loadFarmsPage}
              >
                <ListItemIcon>
                  {" "}
                  <NatureIcon
                    className={this.isSelected("farms") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Farms" />
              </ListItem>

              <ListItem
                className={this.isSelected("foodbanks") && classes.selected}
                button
                key="Food Banks"
                onClick={this.loadFoodBanksPage}
              >
                <ListItemIcon>
                  {" "}
                  <BankIcon
                    className={this.isSelected("foodbanks") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Food Banks" />
              </ListItem>

              <ListItem
                button
                className={this.isSelected("deals") && classes.selected}
                key="Deals"
                onClick={this.loadTodoPage}
              >
                <ListItemIcon>
                  {" "}
                  <DealIcon
                    className={this.isSelected("deals") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Deals" />
              </ListItem>

              <ListItem
                button
                className={this.isSelected("surplus") && classes.selected}
                key="Surplus"
                onClick={this.loadSurplusPage}
              >
                <ListItemIcon>
                  {" "}
                  <ChartIcon
                    className={this.isSelected("surplus") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Surplus" />
              </ListItem>

              <ListItem
                button
                className={this.isSelected("produce") && classes.selected}
                key="Produce"
                onClick={this.loadProducePage}
              >
                <ListItemIcon>
                  {" "}
                  <EcoIcon
                    className={this.isSelected("produce") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Produce" />
              </ListItem>

              <ListItem
                button
                className={this.isSelected("account") && classes.selected}
                key="Account"
                onClick={this.loadAccountPage}
              >
                <ListItemIcon>
                  {" "}
                  <AccountBoxIcon
                    className={this.isSelected("account") && classes.selected}
                  />{" "}
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>

              <ListItem button key="Logout" onClick={this.logoutHandler}>
                <ListItemIcon>
                  {" "}
                  <ExitToAppIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>

          <div className={classes.contentContainer}>
            <Alert
              open={this.state.showAlert}
              handleOpen={this.openAlert}
              handleClose={this.closeAlert}
              severity={this.state.severity}
              message={this.state.message}
            />
            {this.state.toRender === "deals" ? (
              <Deal alert={this.alert} />
            ) : this.state.toRender === "account" ? (
              <Account alert={this.alert} />
            ) : this.state.toRender === "produce" ? (
              <Produce alert={this.alert} />
            ) : this.state.toRender === "surplus" ? (
              <Surplus alert={this.alert} />
            ) : this.state.toRender === "farms" ? (
              <Farms alert={this.alert} />
            ) : (
              <FoodBanks alert={this.alert} />
            )}
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(home);
