import React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { authMiddleWare } from "../util/auth";

/**
 * Creates an asynchronous input that will query database for options
<<<<<<< HEAD
<<<<<<< HEAD
 * when it is opened by the user (to avoid loading on page reload). 
 * @param props Properties passed from parent that determine where the 
 *              data should come from, how to update the input state in the 
 *              parent, and other settings of the input 
=======
=======
>>>>>>> 44d6f0ca38844a8d7316d025f0228e44e36a8e2e
 * when it is opened by the user (to avoid loading on page reload).
 * @param props Properties passed from parent that determine where the
 *              data should come from, how to update the input state in the
 *              parent, and other settings of the input
<<<<<<< HEAD
>>>>>>> d7aa28ac075b414b0c0cf3e6ae4caf3f7fd355ed
=======
>>>>>>> 44d6f0ca38844a8d7316d025f0228e44e36a8e2e
 */
export default function AsynchronousInput(props) {
  // whether or not the input is open
  const [open, setOpen] = React.useState(false);
  // options for the input
  const [options, setOptions] = React.useState([]);
  // determines whether or not to show loading circle
  const loading = open && options.length === 0;

  /** Returns the authentication token stored in local storage */
  const getAuth = () => {
    authMiddleWare(props.history);
    return localStorage.getItem("AuthToken");
<<<<<<< HEAD
<<<<<<< HEAD
  }
=======
  };
>>>>>>> d7aa28ac075b414b0c0cf3e6ae4caf3f7fd355ed
=======
  };
>>>>>>> 44d6f0ca38844a8d7316d025f0228e44e36a8e2e

  /** Asynchronously loads in the possible responses from props.target path */
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return;
    }

    (async () => {
      axios.defaults.headers.common = { Authorization: `${getAuth()}` };
      axios
        .get(props.target)
        .then((response) => {
          if (active) {
            setOptions(response.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id={props.returnValue}
      fullWidth
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        if (newValue === null) return;
        props.handleChange(props.returnValue, newValue[props.paramName]);
      }}
      getOptionSelected={props.optionSelected}
      getOptionLabel={props.optionLabel}
      defaultValue={props.value}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> d7aa28ac075b414b0c0cf3e6ae4caf3f7fd355ed
=======
}
>>>>>>> 44d6f0ca38844a8d7316d025f0228e44e36a8e2e
