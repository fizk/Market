/**
 * Created by einar.adalsteinsson on 2/13/17.
 */

"use strict";
export default array => {
    return array.map(item => {
        return {
            ...item,
            selected: false
        }
    });
};
