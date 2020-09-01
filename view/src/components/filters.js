import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import axios from "axios";
import { authMiddleWare } from "../util/auth";

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
      locationId: "",
      distance: "0",
      days: "0",
      hours: "0",
      minutes: "0",
      results: "",
    };
  }

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
    console.log("URL", url);
    // axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios.get(url).then((res) => {
      this.setState(
        { results: res.data },
        console.log("results[]:", res.data, "res", res)
      );
      // make this async next
      return this.props.render(this.state.results);
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

    axios.defaults.headers.common = { Authorization: `${this.getAuth()}` };
    axios.get(url).then((res) => {
      this.setState({ results: res.data });
      return this.props.render(this.state.results);
    });
  };

  render() {
    return (
      <div>
        <TextField
          variant="outlined"
          label="Location ID"
          name="locationId"
          value={this.state.locationId}
          onChange={this.handleChange}
        />
        <div>
          <TextField
            variant="outlined"
            label="Distance (Miles)"
            name="distance"
            value={this.state.distance}
            onChange={this.handleChange}
          />
          <Button onClick={this.filterByDistance}>Filter by Distance</Button>
        </div>
        <div>
          <TextField
            variant="outlined"
            label="Days"
            name="days"
            value={this.state.days}
            onChange={this.handleChange}
          />
          <TextField
            variant="outlined"
            label="Hours"
            name="hours"
            value={this.state.hours}
            onChange={this.handleChange}
          />
          <TextField
            variant="outlined"
            label="Minutes"
            name="minutes"
            value={this.state.minutes}
            onChange={this.handleChange}
          />
          <Button onClick={this.filterByTravelTime}>
            Filter by Travel Time
          </Button>
        </div>
      </div>
    );
  }
}

export default Filters;
