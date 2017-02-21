import React from 'react';
import {Map} from '../components/Map';

class ListingMap extends React.Component {
    render() {
        return (
            <Map
                position={{lat: this.props.lat, lng: this.props.lng}}
                markers={this.props.listings}
                containerElement={<div className="outer" style={{ height: `100%`, width: '100%', }} />}
                mapElement={<div className="inner" style={{ height: `100%`, width: '100%' }} />}
                onMarkerClick={this.props.onMarkerClick}
                onMapClick={this.props.onMapClick}
            />
        )
    }
}

ListingMap.propTypes = {
    listings: React.PropTypes.array,
    lat: React.PropTypes.number,
    lng: React.PropTypes.number,
    onMarkerClick: React.PropTypes.func,
    onMapClick: React.PropTypes.func,
};

ListingMap.defaultTypes = {
    listings: [],
    lat: 0,
    lng: 0,
    onMarkerClick: () => {},
    onMapClick: () => {},
};

export {ListingMap}
