/**
 * Created by einar.adalsteinsson on 1/3/17.
 */
'use strict';

import React from 'react';
import { withGoogleMap, GoogleMap, Marker} from "react-google-maps";

const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{lat: -37.8029898, lng: 144.9552392}}
        onClick={(event) => props.onMapClick(event.latLng.lat(), event.latLng.lng())}
    >
        {props.markers.map(marker => {
            if (marker.selected) {
                return <Marker key={`marker-${marker.listing_id}`}
                        icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        position={{lat: marker.lat, lng: marker.lng}}/>
            } else {
                return <Marker key={`marker-${marker.listing_id}`}
                        onClick={event => props.onMarkerClick(event, marker.listing_id, marker.lat,marker.lng)}
                        position={{lat: marker.lat, lng: marker.lng}}/>
            }

        })}
        <Marker key={`marker-my-position`}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                position={props.position}/>
    </GoogleMap>
));

Map.propTypes = {
    markers: React.PropTypes.array,
    onMarkerClick: React.PropTypes.func,
    onMapClick: React.PropTypes.func,
    position: React.PropTypes.shape({
        lat: React.PropTypes.number,
        lng: React.PropTypes.number
    })
};

Map.defaultProps = {
    markers: [],
    position: {
        lat: -37.8029898,
        lng: 144.9552392
    }
};

export {Map}
