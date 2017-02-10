/**
 * Created by einar.adalsteinsson on 1/3/17.
 */

"use strict";

export default (state = {markers: [], selected: undefined}, action) => {
    switch (action.type) {
        case 'SET_MARKERS':
            return {
                selected: undefined,
                markers: Object.keys(action.data).map(key => {
                    return action.data[key];
                })
            };
            break;
        case 'SELECT_MARKER':
            return {
                ...state,
                selected: state.markers.filter(item => {
                    return item.listing_id == action.id;
                })
            };
            break;
        case 'UN_SELECT_LISTING':
            return {
                ...state,
                selected: undefined
            };
            break;
        default:
            return state;
            break;
    }
}
