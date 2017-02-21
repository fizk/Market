/**
 * Created by einar.adalsteinsson on 2/20/17.
 */

export default {
    getNextSaturday: () => {
        const day = new Date().getDay();
        if (day == 6) {
            return new Date();
        } else {
            return new Date(new Date().setDate(new Date().getDate() + (6 - day)));

        }
    }
}
