/**
 * Created by einar.adalsteinsson on 1/3/17.
 */

"use strict";

export default (state = {markers: []}, action) => {
    switch (action.type) {
        case 'SET_MARKERS':
            return {
                markers: Object.keys(action.data).map(key => {
                    return action.data[key];
                })
            };
            break;
        default:
            return state;
            break;
    }
}
