'use strict';

import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';

const radiusRange = [
    {value:  1, label: 'One km'},
    {value:  5, label: 'Five km'},
    {value: 10, label: 'Ten km'},
    {value: 20, label: 'Twenty km'},
    {value: 50, label: 'Fifty km'}
];

class QueryFilter extends React.Component {
    render() {
        return (
            <div style={{padding: '16px'}}>
                <SelectField
                    floatingLabelText="Radius"
                    value={this.props.radius}
                    onChange={(event, index, value) => this.props.onRadiusChange(value)}>
                    {radiusRange.map(item => <MenuItem key={`select-field-${item.label}`} value={item.value} primaryText={item.label} />)}
                </SelectField>
                <SelectField
                    floatingLabelText="Categories"
                    value={this.props.category}
                    onChange={(event, index, value) => this.props.onCategoryChange(value)}>
                    <MenuItem value={null} primaryText="" />
                    {this.props.categories.map(item => <MenuItem key={`select-field-${item.category}`} value={item.category} primaryText={item.category} />)}
                </SelectField>
                <DatePicker
                    floatingLabelText="From"
                    value={this.props.from}
                    onChange={(event, date) => this.props.onFromChange(date)}
                />
                <DatePicker
                    floatingLabelText="To"
                    value={this.props.to}
                    onChange={(event, date) => this.props.onToChange(date)}
                />
            </div>
        )
    }
}

QueryFilter.propTypes = {
    categories: React.PropTypes.array,
    category: React.PropTypes.string,
    radius: React.PropTypes.number,
    to: React.PropTypes.object,
    from: React.PropTypes.object,
    onRadiusChange: React.PropTypes.func,
    onFromChange: React.PropTypes.func,
    onToChange: React.PropTypes.func,
    onCategoryChange: React.PropTypes.func
};

QueryFilter.defaultTypes = {
    categories: [],
    category: null,
    radius: 0,
    to: new Date(),
    from: new Date(),
    onRadiusChange: () => {},
    onFromChange: () => {},
    onToChange: () => {},
    onCategoryChange: () => {}
};

export {QueryFilter}
