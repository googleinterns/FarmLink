import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import axios from "axios";

class Filters extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locationId: "",
            distance: "0",
            days: "0",
            hours: "0",
            minutes: "0",
            results: [],
        }
    }

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
        url += `?locationId=${this.state.locationId}&distance=${this.state.distance}`;
        axios.get(url)
        .then(res => {
            this.setState({results: res.data});
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
        url += `?locationId=${this.state.locationId}&days=${this.state.days}&hours=${this.state.hours}&minutes=${this.state.minutes}`;
        axios.get(url)
        .then(res => {
            this.setState({results: res.data});
        });
    };

    render() {
        return (
            <div>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" label="Location ID" name="locationId" value={this.state.locationId} onChange={this.handleChange} />
                <div>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" label="Distance (Miles)" name="distance" value={this.state.distance} onChange={this.handleChange} />
                    <Button onClick={this.filterByDistance}>Filter by Distance</Button>
                </div>
                <div>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" label="Days" name="days" value={this.state.days} onChange={this.handleChange} />
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" label="Hours" name="hours" value={this.state.hours} onChange={this.handleChange} />
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" label="Minutes" name="minutes" value={this.state.minutes} onChange={this.handleChange} />
                    <Button onClick={this.filterByTravelTime}>Filter by Travel Time</Button>
                </div>
            </div>
        );
    }
}

export default Filters;