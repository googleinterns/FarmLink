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
import CardSkeletons from "../extras/skeleton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DealStepper from "../extras/dealStepper";

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
    marginBottom: "12px",
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
    margin: "0px",
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
    marginLeft: "0px",
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
 * This class represents a Deal component, which is a sub-page of the
 * home page where deal objects are visualized, created, updated, edited,
 * and deleted.
 */
class Deal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Deal states (haven't been connected to CRUD)
      deals: "",
      title: "",
      body: "",
      todoId: "",
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

  /** Load in all of the current deals when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/todos")
      .then((response) => {
        this.setState({
          // Produce state
          deals: response.data,
          // Page state
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Takes a deal object as an input and deletes the given deal
   * object from the database
   * @param data A deal object
   */
  handleDelete(data) {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let todoId = data.todo.todoId;
    axios
      .delete(`todo/${todoId}`) // NOT CONNECTED TO DEALS CRUD YET
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Takes a deal object as an input and opens a dialog page to
   * allow the user to update the attributes of the deal object
   * @param data A deal object
   */
  handleEditClick(data) {
    this.setState({
      // Deal state
      title: data.todo.title,
      body: data.todo.body,
      todoId: data.todo.todoId,
      // Page state
      buttonType: "Edit",
      open: true,
    });
  }

  /**
   * Takes a deal object as an input and opens a popup with all the
   * information about the deal (currently not being used -> will be
   * updated to show augmented information)
   * @param data A deal object
   */
  handleViewOpen(data) {
    this.setState({
      // Deal state
      title: data.todo.title,
      body: data.todo.body,
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
        // Deal states
        todoId: "",
        title: "",
        body: "",
        buttonType: "",
        // Page state
        open: true,
      });
    };

    /**
     * Either updates or submits a new deal object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      event.preventDefault();
      const userTodo = {
        // Deal states
        title: this.state.title,
        body: this.state.body,
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/todo/${this.state.todoId}`, // NOT CONNECTED TO CRUD YET
          method: "put",
          data: userTodo,
        };
      } else {
        options = {
          url: "/todo",
          method: "post",
          data: userTodo,
        };
      }
      axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
      axios(options)
        .then(() => {
          // Page state
          this.setState({ open: false });
          window.location.reload();
        })
        .catch((error) => {
          // Page state
          this.setState({ open: true, errors: error.response.data });
          console.error(error);
        });
    };

    const handleViewClose = () => {
      // Page state
      this.setState({ viewOpen: false });
    };

    const handleDialogClose = (event) => {
      // Page state
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
                    ? "Edit Deal"
                    : "Create a new Deal"}
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
              <DealStepper alert={this.props.alert} />
            </Container>
          </Dialog>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
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
              {this.state.deals.map((todo) => (
                <Grid item xs={12}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {todo.title}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        {dayjs(todo.createdAt).fromNow()}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {todo.body}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleViewOpen({ todo })}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleEditClick({ todo })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleDelete({ todo })}
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
              {this.state.title}
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                id="todoDetails"
                name="body"
                multiline
                readonly
                rows={1}
                rowsMax={25}
                value={this.state.body}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </DialogContent>
          </Dialog>
        </main>
      );
    }
  }
}

export default withStyles(styles)(Deal);
