'use strict';

import React from 'react';
import App from './App';
import {connect} from 'react-redux';
import {fetchMarkers, selectMarker, fetchCategories} from '../actions/markers-actions';
import DateHelper from '../helpers/date'

const withStateManagement = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.queryForListings = this.queryForListings.bind(this);
            this.queryForListing = this.queryForListing.bind(this);

            this.state = {
                drawerOpen: false,
                radius: 5,
                lat: 0,
                lng: 0,
                from: DateHelper.getNextSaturday(),
                to: DateHelper.getNextSaturday(),
                category: undefined
            };

            this.props.onLoadCategories();

            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                this.props.onLoadMarkers(
                    position.coords.latitude,
                    position.coords.longitude,
                    this.state.radius,
                    this.state.from,
                    this.state.to,
                    this.state.category
                );
            }, error => {
                console.error(error);
                this.setState({
                    lat: -37.8030002,
                    lng: 144.9551522
                });
                this.props.onLoadMarkers(-37.8030002, 144.9551522);

            });
        }

        queryForListings(value) {
            let {lat, lng, radius, from, to, category} = {...this.state, ...value};
            this.props.onLoadMarkers(lat, lng, radius, from, to, category);

            this.setState(value)
        }

        queryForListing(id) {
            console.log(`queryForListing(${id})`);
            this.props.onClickMarker(id);
        }

        render() {
            return <WrappedComponent
                listings={this.props.listings}
                categories={this.props.categories}
                marked={this.props.marked}
                onQueryFilterChange={this.queryForListings}
                onListingSelect={this.queryForListing}
                {...this.state} />
        }
    }
};

const mapStateToProps = (state) => {
    return {
        listings: state.listings,
        marked: state.marked,
        categories: state.categories,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadMarkers: (lat, lng, radius, from, to, category) => dispatch(fetchMarkers(lat, lng, radius, from, to, category)),
        onLoadCategories: () => dispatch(fetchCategories()),
        onClickMarker: id => dispatch(selectMarker(id)),
    };
};

const AppProvider = connect(mapStateToProps, mapDispatchToProps)(withStateManagement(App));

export {AppProvider}
