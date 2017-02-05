/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const Map = withGoogleMap(props => (
    <GoogleMap defaultZoom={10} defaultCenter={{lat: -37.8029898, lng: 144.9552392}}>
        {props.markers.map(marker => (
            <Marker key={`marker-${marker.listing_id}`}
                    onClick={event => props.onMarkerClick(event, marker.listing_id, marker.lat,marker.lng)}
                    position={{lat: marker.lat, lng: marker.lng}}/>
        ))}
    </GoogleMap>
));

Map.propTypes = {
    markers: React.PropTypes.array,
    onMarkerClick: React.PropTypes.func
};

Map.defaultProps = {
    markers: []
};

export {Map}
