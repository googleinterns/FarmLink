import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

/**
 * Creates an alert that shows up on the snackbar to help
 * users visualize when certain action are completed or if
 * errors occur
 * @param props Determine severity of alert, message presented
 *              and control opening and closing of the alert
 */
export default function CustomizedSnackbars(props) {
  // Styling and duration of the alert
  const classes = useStyles();
  const alertDuration = 6000;

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open}
        autoHideDuration={alertDuration}
        onClose={props.handleClose}
      >
        <Alert onClose={props.handleClose} severity={props.severity}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
