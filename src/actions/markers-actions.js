/**
 * Created by einar.adalsteinsson on 1/6/17.
 */

"use strict";
import listingDecorator from '../helpers/listingDecorator';
import fetch from 'isomorphic-fetch';

const fetchMarkersEnd = (json) => {
    return {
        type: 'SET_MARKERS',
        data: json
    }
};

const fetchMarkers = (lat, lng, radius = 5) => {
    return dispatch => {
        return fetch(`/listings?lat=${lat}&lng=${lng}&radius=${radius}`)
            .then(response => response.json())
            .then(json => listingDecorator(json))
            .then(json => dispatch(fetchMarkersEnd(json)));
    }
};

const selectMarker = id => {
    return {
        type: 'SELECT_MARKER',
        id: id
    }
};

export {fetchMarkers, selectMarker}
