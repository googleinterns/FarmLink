import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { authMiddleWare } from "../util/auth";

export default function Asynchronous(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return;
    }

    (async () => {
      authMiddleWare(props.history);
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
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
}
