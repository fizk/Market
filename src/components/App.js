/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Map} from '../components/Map';
import {fetchMarkers} from '../actions/markers-actions';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Slider from 'material-ui/Slider';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleFetch = this.handleFetch.bind(this);

        this.onSliderDragStop = this.onSliderDragStop.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);

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
            })
        });
    }

    handleToggle() {
        this.setState({open: !this.state.open});
    }

    handleClose() {
        this.setState({open: false});
    }

    handleFetch() {
        navigator.geolocation.getCurrentPosition(position => {
            this.props.onLoadMarkers(position.coords.latitude, position.coords.longitude, 20);
        });
    }

    onSliderDragStop() {
        this.props.onLoadMarkers(this.state.lat, this.state.lng, this.state.radius);
    }

    onSliderChange(event, value) {
        this.setState({
            radius: value
        })
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <FloatingActionButton
                        secondary={true}
                        style={{position: 'absolute', left: 20, bottom: 20, zIndex: 100}}
                        onTouchTap={this.handleToggle}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <div style={{display: 'flex'}}>
                        <Map
                            markers={this.props.markers}
                            containerElement={<div style={{ height: `100vh`, width: '100vw' }} />}
                            mapElement={<div style={{ height: `100vh`, width: '100vw' }} />}
                            onMarkerClick={(event, id, lat, lng) => console.log(event, id, lat, lng)}
                        />
                    </div>

                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}>
                        <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
                        <MenuItem onTouchTap={this.handleFetch}>Menu Item 2</MenuItem>
                        <Slider
                            style={{width: '100%'}}
                            step={5}
                            onChange={this.onSliderChange}
                            axis="x"
                            defaultValue={5}
                            onDragStop={this.onSliderDragStop}
                            min={0}
                            max={200} />
                    </Drawer>
                </div>
            </MuiThemeProvider>
        )
    }
}

App.propTypes = {
    markers: React.PropTypes.array
};

App.defaultProps = {
    markers: []
};

const mapStateToProps = (state) => {
    return {
        markers: state.markers
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onLoadMarkers: (lat, lng, radius) => dispatch(fetchMarkers(lat, lng, radius))
    };
};

const AppProvider = connect(mapStateToProps, mapDispatchToProps)(App);

export {App, AppProvider}
