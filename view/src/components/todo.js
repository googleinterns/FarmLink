import React, { Component } from "react";

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
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

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
  dialogStyle: {
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
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This class represents a Todo components, which is a sub-page of the
 * home page where todo objects are visualized, created, updated, edited,
 * and deleted.
 */
class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: "",
      title: "",
      body: "",
      todoId: "",
      errors: [],
      open: false,
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
    };

    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);
  }

  /** Load in all of the current todos when the component has mounted */
  componentDidMount() {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios
      .get("/todos")
      .then((response) => {
        this.setState({
          todos: response.data,
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
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
   * Takes a todo object as an input and deletes the given todo
   * object from the database
   * @param data A todo object
   */
  handleDeleteTodo(data) {
    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    let todoId = data.todo.todoId;
    axios
      .delete(`todo/${todoId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Takes a todo object as an input and opens a dialog page to
   * allow the user to update the attributes of the todo object
   * @param data A todo object
   */
  handleEditClick(data) {
    this.setState({
      title: data.todo.title,
      body: data.todo.body,
      todoId: data.todo.todoId,
      buttonType: "Edit",
      open: true,
    });
  }

  /**
   * Takes a todo object as an input and opens a popup with all the
   * information about the todo (currently not being used -> will be
   * updated to show augmented information)
   * @param data A todo object
   */
  handleViewOpen(data) {
    this.setState({
      title: data.todo.title,
      body: data.todo.body,
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

    /** Set all states to generic value when opening a dialog page */
    const handleClickOpen = () => {
      this.setState({
        todoId: "",
        title: "",
        body: "",
        buttonType: "",
        open: true,
      });
    };

    /**
     * Either updates or submits a new todo object to the data base
     * @param event The event being handled
     */
    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      const userTodo = {
        title: this.state.title,
        body: this.state.body,
      };
      let options = {};
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/todo/${this.state.todoId}`,
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
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          this.setState({ open: false });
          window.location.reload();
        })
        .catch((error) => {
          this.setState({ open: true, errors: error.response.data });
          console.error(error);
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
          <div className={classes.toolbar} />
          {this.state.uiLoading && (
            <CircularProgress size={150} className={classes.uiProgess} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <IconButton
            className={classes.floatingButton}
            color="primary"
            aria-label="Add Todo"
            onClick={handleClickOpen}
          >
            <AddCircleIcon style={{ fontSize: 60 }} />
          </IconButton>
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
                    ? "Edit Todo"
                    : "Create a new Todo"}
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

            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="todoTitle"
                    label="Todo Title"
                    name="title"
                    autoComplete="todoTitle"
                    helperText={errors.title}
                    value={this.state.title}
                    error={errors.title ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="todoDetails"
                    label="Todo Details"
                    name="body"
                    autoComplete="todoDetails"
                    multiline
                    rows={25}
                    rowsMax={25}
                    helperText={errors.body}
                    error={errors.body ? true : false}
                    onChange={this.handleChange}
                    value={this.state.body}
                  />
                </Grid>
              </Grid>
            </form>
          </Dialog>

          <Grid container spacing={2}>
            {this.state.todos.map((todo) => (
              <Grid item xs={12} sm={6} key={todo.todoId}>
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {todo.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {dayjs(todo.createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {`${todo.body.substring(0, 65)}`}
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
                      onClick={() => this.handleDeleteTodo({ todo })}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

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

export default withStyles(styles)(Todo);
