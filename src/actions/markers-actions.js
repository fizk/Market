/**
 * Created by einar.adalsteinsson on 1/6/17.
 */

"use strict";
import fetch from 'isomorphic-fetch';

const fetchMarkersEnd = (json) => {
    return {
        type: 'SET_MARKERS',
        data: json
    }
};

const fetchMarkers = (lat, lng, radius = 5) => {
    return dispatch => {
        return fetch(`https://107.170.87.126:9090/listings?lat=${lat}&lng=${lng}&radius=${radius}`)
            .then(response => response.json())
            .then(json => {
                dispatch(fetchMarkersEnd(json._embedded.listings));
            });
    }
};

export {fetchMarkers}