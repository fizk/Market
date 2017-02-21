'use strict';

import React from 'react';
import Markdown from 'react-remarkable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class MarkedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.handleExpandChange = this.handleExpandChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.active === false) {
            this.setState({
                expanded: false
            });
        }
    }

    handleExpandChange = (expanded) => {
        this.setState({
            expanded: expanded
        });
    };

    render() {
        const cardStyle = {
            zIndex: 1,
            position: 'absolute',
            bottom: 0,
            width: '100vw',
            backgroundColor: 'white'
        };
        
        return (
            <Card expanded={this.state.expanded}
                  onExpandChange={this.handleExpandChange}
                  containerStyle={cardStyle}>
                <CardHeader
                    title={this.props.marked.name}
                    subtitle={this.props.marked.open}
                    avatar={this.props.marked.avatarUrl}
                    actAsExpander={this.props.active}
                    showExpandableButton={this.props.active}/>
                <CardText expandable={true}>
                    <a href={this.props.marked.url} target="_blank">website</a>
                    <p>{this.props.marked.open}</p>
                    <p>{this.props.marked.close}</p>
                    {this.props.marked.categories.map(category => {
                        return <p key={`category-${category.category}`}>{category.category}</p>
                    })}
                    <Markdown>
                        {this.props.marked.content}
                    </Markdown>
                </CardText>
            </Card>
        );
    }
}

MarkedCard.propTypes = {
    active: React.PropTypes.bool,
    marked: React.PropTypes.shape({
        listing_id: React.PropTypes.number,
        name: React.PropTypes.string,
        open: React.PropTypes.string,
        close: React.PropTypes.string,
        content: React.PropTypes.string,
        categories: React.PropTypes.array
    }),
};

MarkedCard.defaultProps = {
    active: false,
    marked: {
        listing_id: undefined,
        name: undefined,
        open: undefined,
        close: undefined,
        content: '',
        categories: []
    }
};

export {MarkedCard}
