/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Map} from '../components/Map';
import {fetchMarkers, selectMarker} from '../actions/markers-actions';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MarkedCard} from './MarkedCard';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
        this.handleRadiusChange = this.handleRadiusChange.bind(this);
        this.handleFromDateChange = this.handleFromDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);

        this.state = {
            drawerOpen: false,
            radius: 5,
            lat: 0,
            lng: 0,
            from: this.getNextSaturday(),
            to: this.getNextSaturday(),
        };

        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            this.props.onLoadMarkers(
                position.coords.latitude,
                position.coords.longitude,
                this.state.radius,
                this.state.from,
                this.state.to
            );
        }, error => {
            console.error(error);
            this.setState({
                lat: -37.8030002,
                lng: 144.9551522
            });
            this.props.onLoadMarkers(-37.8030002, 144.9551522);

        });
    }

    handleFromDateChange(event, date) {
        this.setState({from: date});
        this.props.onLoadMarkers(
            this.state.lat,
            this.state.lng,
            this.state.radius,
            date,
            this.state.to
        );
    }

    handleToDateChange(event, date) {
        this.setState({to: date});
        this.props.onLoadMarkers(
            this.state.lat,
            this.state.lng,
            this.state.radius,
            this.state.from,
            date
        );
    }

    handleOpenDrawer() {
        this.setState({drawerOpen: true});
    }

    handleMapClick(lat, lng) {
        this.setState({
            lat: lat,
            lng: lng
        });
        this.props.onLoadMarkers(
            lat,
            lng,
            this.state.radius,
            this.state.from,
            this.state.to
        );
    }

    handleRadiusChange(event, index, value) {
        this.setState({radius: value});
        this.props.onLoadMarkers(
            this.state.lat,
            this.state.lng,
            value,
            this.state.from,
            this.state.to
        );
    }

    /** @todo not tested */
    getNextSaturday() {
        const day = new Date().getDay();
        if (day == 5) {
            return new Date();
        } else {
            return new Date(new Date().setDate(new Date().getDate() + (6 - day)));

        }
    }


    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <AppBar
                        title={`Market Map`}
                        iconElementLeft={<IconButton onTouchTap={this.handleOpenDrawer}><NavigationClose /></IconButton>}
                    />
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.drawerOpen}
                        onRequestChange={(open) => this.setState({drawerOpen: open})}>
                        <SelectField
                            floatingLabelText="Frequency"
                            value={this.state.value}
                            onChange={this.handleRadiusChange}
                        >
                            <MenuItem value={1} primaryText="One" />
                            <MenuItem value={5} primaryText="Five" />
                            <MenuItem value={10} primaryText="Ten" />
                            <MenuItem value={20} primaryText="Twenty" />
                            <MenuItem value={50} primaryText="Fifty" />
                        </SelectField>
                        <DatePicker
                            floatingLabelText="From date"
                            onChange={this.handleFromDateChange}
                        />
                        <DatePicker
                            floatingLabelText="To date"
                            onChange={this.handleToDateChange}
                        />
                    </Drawer>
                    <Map
                        position={{lat: this.state.lat, lng: this.state.lng}}
                        markers={this.props.markers}
                        containerElement={<div style={{ height: `100vh`, width: '100vw', position: 'absolute' }} />}
                        mapElement={<div style={{ height: `100vh`, width: '100vw' }} />}
                        onMarkerClick={this.props.onClickMarker}
                        onMapClick={this.handleMapClick}
                    />
                    <MarkedCard selected={this.props.selected} />
                </div>
            </MuiThemeProvider>
        )
    }
}

App.propTypes = {
    markers: React.PropTypes.array,
    selected: React.PropTypes.array,
};

App.defaultProps = {
    markers: [],
    selected: undefined
};

const mapStateToProps = (state) => {
    return {
        markers: state.markers,
        selected: state.selected,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onLoadMarkers: (lat, lng, radius, from, to) => dispatch(fetchMarkers(lat, lng, radius, from, to)),
        onClickMarker: (event, id, lat, lng) => dispatch(selectMarker(id)),

    };
};

const AppProvider = connect(mapStateToProps, mapDispatchToProps)(App);

export {App, AppProvider}
