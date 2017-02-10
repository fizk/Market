/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Map} from '../components/Map';
import {fetchMarkers, selectMarker, unSelectListing} from '../actions/markers-actions';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Markdown from 'react-remarkable';

class App extends React.Component {
    constructor(props) {
        super(props);

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

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    {this.props.selected && <Card>
                        <CardHeader
                            title={this.props.selected[0].name}
                            avatar={`http://www.mymarketsvic.com.au/directory/files/logo/${this.props.selected[0].listing_id}.jpg`}
                            actAsExpander={true}
                            showExpandableButton={true}
                        />

                        <CardText expandable={true}>
                            <a href={this.props.selected[0].url} target="_blank">website</a>
                            <p>{this.props.selected[0].open}</p>
                            <p>{this.props.selected[0].close}</p>
                            <Markdown>
                                {this.props.selected[0].content}
                            </Markdown>
                        </CardText>
                        <CardActions>
                            <FlatButton onTouchTap={this.props.onClickCardDiscard} label="close" />
                            {/*<FlatButton label="Action2" />*/}
                        </CardActions>
                    </Card>}

                    <div style={{display: 'flex'}}>
                        <Map
                            position={{lat: this.state.lat, lng: this.state.lng}}
                            markers={this.props.markers}
                            containerElement={<div style={{ height: `100vh`, width: '100vw' }} />}
                            mapElement={<div style={{ height: `100vh`, width: '100vw' }} />}
                            onMarkerClick={this.props.onClickMarker}
                        />
                    </div>
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
        onClickCardDiscard: () => dispatch(unSelectListing())

    };
};

const AppProvider = connect(mapStateToProps, mapDispatchToProps)(App);

export {App, AppProvider}
