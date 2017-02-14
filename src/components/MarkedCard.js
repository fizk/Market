/**
 * Created by einar.adalsteinsson on 2/13/17.
 */

import React from 'react';
import Markdown from 'react-remarkable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class MarkedCard extends React.Component {
    render() {
        return (<Card containerStyle={{zIndex: 1, position: 'absolute', bottom: 0, width: '100vw', backgroundColor: 'white'}}>
            <CardHeader
                title={this.props.selected[0].name}
                subtitle={this.props.selected[0].open}
                avatar={`http://www.mymarketsvic.com.au/directory/files/logo/${this.props.selected[0].listing_id}.jpg`}
                actAsExpander={true}
                showExpandableButton={true}
            />

            <CardText expandable={true}>
                <a href={this.props.selected[0].url} target="_blank">website</a>
                <p>{this.props.selected[0].open}</p>
                <p>{this.props.selected[0].close}</p>
                <Markdown>
                    {this.props.selected[0].content}
                </Markdown>
            </CardText>
        </Card>);
    }
}
MarkedCard.propTypes = {
    selected: React.PropTypes.array,
};

MarkedCard.defaultProps = {
    selected: [{
        listing_id: undefined,
        name: 'No Name',
        open: undefined,
        close: undefined,
        content: ''
    }]
};

export {MarkedCard}
