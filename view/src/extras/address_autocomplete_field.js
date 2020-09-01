import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

/**
 * This function creates a script tag with the src and id
 * set to the value of the parameters. It is the child of
 * of the position parameter
 * @param src       The source for the script tag
 * @param position  The parent object of the script tag
 * @param id        The id of the script tag
 */
function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  searchBars: {
    marginTop: theme.spacing(3),
  },
}));

/**
 * This functional component exports a form input field that autocompletes
 * user's location queries. It queries the Google place API and uses the
 * handle location prop passed from the parent to save the desired information
 * from the resulting location.
 * @param props Used to pass default location from parent and function
 *              to handle location change in parent
 */
export default function AddressAutocompleteField(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.location);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  // Add the script tag using loadScript
  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDSPAadPOPcdIXimF1DTzKcHcp7TKa0ht8&libraries=places",
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  // Handles the rendering of potential location options for the autocomplete field
  const handleOptionsRender = (option) => {
    let matches;
    let parts;
    if (option && option.structured_formatting.main_text_matched_substrings) {
      matches = option.structured_formatting.main_text_matched_substrings;
      parts = parse(
        option.structured_formatting.main_text,
        matches.map((match) => [match.offset, match.offset + match.length])
      );
    } else {
      console.error("Error occurred when loading address autocomplete options");
    }

    return (
      <Grid container alignItems="center">
        <Grid item>
          <LocationOnIcon className={classes.icon} />
        </Grid>
        <Grid item xs>
          {parts.map((part, index) => (
            <span
              key={index}
              style={{ fontWeight: part.highlight ? 700 : 400 }}
            >
              {part.text}
            </span>
          ))}

          <Typography variant="body2" color="textSecondary">
            {option.structured_formatting.secondary_text}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  // Used to memoize results from API (for optimization)
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  // Used to update the options for the autocomplete field
  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="location"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      className={props.searching ? classes.searchBars : null}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        props.handleLocation(newValue);
      }}
      renderTags={(value) => {
        props.handleLocation(value);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.searching ? props.TextFieldLabel : "Add a location"}
          placeholder={props.searching ? props.PlaceholderText : ""}
          variant="outlined"
          fullWidth
          InputProps={
            !props.searching
              ? null
              : {
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }
          }
        />
      )}
      renderOption={handleOptionsRender}
    />
  );
}
