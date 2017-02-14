/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Map} from '../components/Map';
import {fetchMarkers, selectMarker} from '../actions/markers-actions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MarkedCard} from './MarkedCard';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapClick = this.handleMapClick.bind(this);

        this.state = {
            radius: 0,
            lat: 0,
            lng: 0
        };

        navigator.geolocation.getCurrentPosition(position => {
            this.props.onLoadMarkers(position.coords.latitude, position.coords.longitude);
            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, error => {
            console.error(error);
            this.props.onLoadMarkers(-37.8030002, 144.9551522);
            this.setState({
                lat: -37.8030002,
                lng: 144.9551522
            });
        });
    }

    handleMapClick(lat, lng) {
        this.props.onLoadMarkers(lat, lng);
        this.setState({
            lat: lat,
            lng: lng
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <Map
                        position={{lat: this.state.lat, lng: this.state.lng}}
                        markers={this.props.markers}
                        containerElement={<div style={{ height: `100vh`, width: '100vw' }} />}
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
        onLoadMarkers: (lat, lng, radius) => dispatch(fetchMarkers(lat, lng, radius)),
        onClickMarker: (event, id, lat, lng) => dispatch(selectMarker(id)),

    };
};

const AppProvider = connect(mapStateToProps, mapDispatchToProps)(App);

export {App, AppProvider}
