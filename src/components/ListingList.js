'use strict';

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class ListingList extends React.Component {
    render() {
        return (
            <List style={{backgroundColor: 'white'}}>
                {this.props.listings.map(item => (
                        <ListItem key={`list-view-item-${item.listing_id}`}
                                  primaryText={item.name}
                                  leftAvatar={<Avatar src={item.avatarUrl} />}
                                  secondaryText={`${item.distance} km`}
                                  onTouchTap={(event) => this.props.onItemClick(item.listing_id)}
                        />
                    )
                )}
            </List>
        )
    }
}

ListingList.propTypes = {
    listings: React.PropTypes.array,
    onItemClick: React.PropTypes.func
};

ListingList.defaultTypes = {
    listings: [],
    onItemClick: () => {}
};

export {ListingList}
