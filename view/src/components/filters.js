import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Typography from "@material-ui/core/Typography";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Address from "../extras/address_autocomplete_field";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import NumberFormat from "react-number-format";

import axios from "axios";
import { authMiddleWare } from "../util/auth";

const styles = (theme) => ({
  searchButton: {
    position: "right",
    left: "8px",
    bottom: "8px",
  },
  searchBars: {
    marginTop: theme.spacing(3),
  },
});

/*
The filters component is used to search farms, food banks, and surplus or suggest a match between a farm and a food bank when making a deal.
When the user fills out the filter fields, the queries are used to find food banks that are close to a farm, find farms that are close to a food bank, and find farms with surplus that are close to a food bank.
<Filters database="foodbanks"> adds the filters component to the food banks page.
<Filters database="farms"> adds the filters component to the farms page.
<Filters database="surplus"> adds the filters component to the surplus page.
*/
class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: "",
      locationId: "",
      distance: "0",
      days: "0",
      hours: "0",
      minutes: "0",
      results: "",
    };
  }

  clearQueries = () => {
    this.setState({
      location: "",
      locationId: "",
      distance: "0",
      days: "0",
      hours: "0",
      minutes: "0",
      results: "",
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  filterByDistance = () => {
    let url = "";
    switch (this.props.database) {
      case "foodbanks":
        url = "/queryFoodBanksByDistance";
        break;
      case "farms":
        url = "/queryFarmsByDistance";
        break;
      case "surplus":
        url = "/querySurplusByDistance";
        break;
    }
    url += "?";
    url += `locationId=${this.state.locationId}`;
    url += "&";
    url += `distance=${this.state.distance}`;

    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios.get(url).then((res) => {
      this.setState({ results: res.data });
    });
  };

  filterByTravelTime = () => {
    let url = "";
    switch (this.props.database) {
      case "foodbanks":
        url = "/queryFoodBanksByTravelTime";
        break;
      case "farms":
        url = "/queryFarmsByTravelTime";
        break;
      case "surplus":
        url = "/querySurplusByTravelTime";
        break;
    }
    url += "?";
    url += `locationId=${this.state.locationId}`;
    url += "&";
    url += `days=${this.state.days}`;
    url += "&";
    url += `hours=${this.state.hours}`;
    url += "&";
    url += `minutes=${this.state.minutes}`;
    axios.get(url).then((res) => {
      this.setState({ results: res.data });
      return this.props.render(this.state.results);
    });
  };

  /** Used to update location from address autocomplete component */
  handleLocation = (newValue) => {
    if (newValue === null) {
      return;
    }
    this.setState({
      // Location states
      location: newValue.description,
      locationId: newValue.place_id,
    });
  };

  render() {
    return (
      <Grid container spacing={3} allignItems="left">
        <Grid item xs={12}>
          <Address
            handleLocation={this.handleLocation}
            location={this.state.location}
            searching={true}
            PlaceholderText="Type or Select a Location to find Nearby Farms"
            TextFieldLabel="Custom Location"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            variant="outlined"
            label="Distance (Miles)"
            name="distance"
            type="number"
            value={this.state.distance}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={10}>
          <Button
            className={styles.searchButton}
            onClick={this.filterByDistance}
            variant="outlined"
            color="primary"
            type="number"
            size="medium"
            startIcon={<SearchIcon />}
          >
            Filter by Distance
          </Button>
        </Grid>
        <Grid item xs={1}>
          <TextField
            variant="outlined"
            label="Days"
            name="days"
            type="number"
            value={this.state.days}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            variant="outlined"
            label="Hours"
            name="hours"
            type="number"
            value={this.state.hours}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            variant="outlined"
            label="Mins"
            name="minutes"
            value={this.state.minutes}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={9}>
          <Button
            className={styles.searchButton}
            onClick={this.filterByTravelTime}
            variant="outlined"
            color="primary"
            type="number"
            size="medium"
            startIcon={<SearchIcon />}
          >
            Filter by Travel Time
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Filters;
