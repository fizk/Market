'use strict';

import React from 'react';

import Drawer from 'material-ui/Drawer';
import Badge from 'material-ui/Badge';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import uiTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NavigationClose from 'material-ui/svg-icons/navigation/menu';
import MapIcon from 'material-ui/svg-icons/maps/map';
import ListIcon from 'material-ui/svg-icons/action/list';

import {MarkedCard} from './MarkedCard';
import {QueryFilter} from './QueryFilter';
import {Layout, LayoutBody, LayoutHeader} from './Layout';
import {ListingList} from './ListingList';
import {ListingMap} from './ListingMap';

const navigationItems = {
    LIST: 'navigation-list',
    MAP: 'navigation-map',
};

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
        this.handleChangeDrawer = this.handleChangeDrawer.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);

        this.state = {
            drawerOpen: false,
            view: navigationItems.MAP
        }
    }

    handleOpenDrawer() {
        this.setState({drawerOpen: true});
    }

    handleChangeDrawer(open) {
        this.setState({drawerOpen: open});
    }

    handleViewChange(type) {
        this.setState({
            view: type,
            drawerOpen: false,
        })
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
                <Layout>
                    <LayoutHeader>
                        <AppBar
                            iconElementRight={
                                <Badge badgeContent={this.props.listings.length} secondary={true} />
                            }
                            iconElementLeft={
                                <IconButton onTouchTap={this.handleOpenDrawer}>
                                    <NavigationClose />
                                </IconButton>
                            }
                        />
                    </LayoutHeader>
                    <LayoutBody>
                        {this.props.marked && <MarkedCard marked={this.props.marked} active={true}/>}

                        {this.state.view === navigationItems.MAP && <ListingMap
                            onMapClick={(lat, lng) => this.props.onQueryFilterChange({lat: lat, lng: lng})}
                            onMarkerClick={(event, id, lat, lng) => this.props.onListingSelect(id)}
                            listings={this.props.listings}
                            lat={this.props.lat}
                            lng={this.props.lng} />}

                        {this.state.view === navigationItems.LIST && <ListingList
                            listings={this.props.listings}
                            onItemClick={id => this.props.onListingSelect(id)}
                        />}

                    </LayoutBody>
                    <Drawer
                        docked={false}
                        width={300}
                        open={this.state.drawerOpen}
                        onRequestChange={this.handleChangeDrawer}>
                        <MenuItem
                            leftIcon={<MapIcon />}
                            primaryText="Map"
                            onTouchTap={() => this.handleViewChange(navigationItems.MAP)}
                        />
                        <MenuItem
                            leftIcon={<ListIcon />}
                            primaryText="List"
                            onTouchTap={() => this.handleViewChange(navigationItems.LIST)}
                        />

                        <Divider />

                        <QueryFilter
                            categories={this.props.categories}
                            radius={this.props.radius}
                            category={this.props.category}
                            from={this.props.from}
                            to={this.props.to}
                            onRadiusChange={radius => this.props.onQueryFilterChange({radius: radius})}
                            onFromChange={date => this.props.onQueryFilterChange({from: date})}
                            onToChange={date => this.props.onQueryFilterChange({to: date})}
                            onCategoryChange={category => this.props.onQueryFilterChange({category: category})}
                        />
                    </Drawer>
                </Layout>
            </MuiThemeProvider>
        )
    }
}

App.propTypes = {
    listings: React.PropTypes.array,
    categories: React.PropTypes.array,
    marked: React.PropTypes.object,
    onQueryFilterChange: React.PropTypes.func,
    onListingSelect: React.PropTypes.func
};

App.defaultProps = {
    listings: [],
    categories: [],
    marked: undefined,
    onQueryFilterChange: value => {},
    onListingSelect: id => {}
};
