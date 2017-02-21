/**
 * Created by einar.adalsteinsson on 1/3/17.
 */

"use strict";

export default (state = {listings: [], marked: undefined, categories: []}, action) => {
    switch (action.type) {
        case 'SET_MARKERS':
            return {
                ...state,
                marked: undefined,
                listings: Object.keys(action.data).map(key => {
                    return action.data[key];
                })
            };
            break;
        case 'SELECT_MARKER':
            return {
                ...state,
                listings: state.listings.map(item => {
                    if (item.listing_id == action.id) {
                        return {
                            ...item,
                            marked: true
                        }
                    } else {
                        return {
                            ...item,
                            marked: false
                        }
                    }
                }),
                marked: state.listings.filter(item => {
                    return item.listing_id == action.id;
                }).reduce((a, b) => b, undefined)
            };
            break;
        case 'FETCH_CATEGORIES':
            return {
                ...state,
                categories: action.categories
            };
            break;
        default:
            return state;
            break;
    }
}
