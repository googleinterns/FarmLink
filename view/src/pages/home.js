// home.js

import React, { Component } from "react";
import axios from "axios";

import Account from "../components/account";
import Todo from "../components/deal";
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
});

class home extends Component {
  // state = {
  //   render: "todos",
  //   showAlert: false,
  //   severity: "",
  //   message: "",
  // };

  openAlert = () => {
    this.setState({ showAlert: true });
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  alert = (newSeverity, newMessage) => {
    this.setState({
      severity: newSeverity,
      message: newMessage,
    });
    //console.log(newSeverity);
    this.openAlert();
  };

  loadAccountPage = (event) => {
    this.setState({ render: "account" });
  };

  loadTodoPage = (event) => {
    this.setState({ render: "todos" });
  };

  loadProducePage = (event) => {
    this.setState({ render: "produce" });
  };

  loadSurplusPage = (event) => {
    this.setState({ render: "surplus" });
  };

  loadFarmsPage = (event) => {
    this.setState({ render: "farms" });
  };

  loadFoodBanksPage = (event) => {
    this.setState({ render: "foodbanks" });
  };

  logoutHandler = (event) => {
    localStorage.removeItem("AuthToken");
    this.props.history.push("/login");
  };

  constructor(props) {
    super(props);

    this.state = {
      render: "todos",
      showAlert: false,
      severity: "",
      message: "",
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
        console.log(response.data);
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
              <ListItem button key="Farms" onClick={this.loadFarmsPage}>
                <ListItemIcon>
                  {" "}
                  <NatureIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Farms" />
              </ListItem>

              <ListItem
                button
                key="Food Banks"
                onClick={this.loadFoodBanksPage}
              >
                <ListItemIcon>
                  {" "}
                  <BankIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Food Banks" />
              </ListItem>

              <ListItem button key="Deals" onClick={this.loadTodoPage}>
                <ListItemIcon>
                  {" "}
                  <DealIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Deals" />
              </ListItem>

              <ListItem button key="Surplus" onClick={this.loadSurplusPage}>
                <ListItemIcon>
                  {" "}
                  <ChartIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Surplus" />
              </ListItem>

              <ListItem button key="Produce" onClick={this.loadProducePage}>
                <ListItemIcon>
                  {" "}
                  <EcoIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Produce" />
              </ListItem>

              <ListItem button key="Account" onClick={this.loadAccountPage}>
                <ListItemIcon>
                  {" "}
                  <AccountBoxIcon />{" "}
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
            {this.state.render === "todos" ? (
              <Todo alert={this.alert} />
            ) : this.state.render === "account" ? (
              <Account alert={this.alert} />
            ) : this.state.render === "produce" ? (
              <Produce alert={this.alert} />
            ) : this.state.render === "surplus" ? (
              <Surplus alert={this.alert} />
            ) : this.state.render === "farms" ? (
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
