"use strict";

export default array => {
    return array.map(item => {
        return {
            ...item,
            marked: false,
            avatarUrl: item.avatar
                ? `http://www.mymarketsvic.com.au/directory/files/logo/${item.listing_id}.jpg`
                : 'http://s4.evcdn.com/images/block/I0-001/029/630/551-2.jpeg_/saturday-riverbank-market-51.jpeg'
        }
    });
};
