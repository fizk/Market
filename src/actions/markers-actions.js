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

const fetchMarkers = (lat, lng, radius, from, to) => {
    return dispatch => {
        const fromDate = `${from.getFullYear()}-${('0'+(from.getMonth()+1).toString()).slice(-2)}-${('0'+from.getDate().toString()).slice(-2)} 00:00`;
        const toDate =   `${to.  getFullYear()}-${('0'+(to.  getMonth()+1).toString()).slice(-2)}-${('0'+to.  getDate().toString()).slice(-2)} 23:59`;

        return fetch(`/listings?lat=${lat}&lng=${lng}&radius=${radius}&from=${fromDate}&to=${toDate}`)
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
