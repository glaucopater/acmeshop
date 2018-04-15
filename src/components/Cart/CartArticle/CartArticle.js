import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './CartArticle.css';
 

class CartArticle extends Component {
    render () {
        let article = null; 

        article = 
        <div className={classes.CartArticle}>
            <a className={classes.ArticleLink} href={"/article/"+this.props.sku}>{this.props.name}</a>
            {this.props.priceAmount}  {this.props.priceCurrency}
            <img className={classes.Image} 
            src={this.props.image} 
            alt={this.props.name}
            /> 
        </div>;

        return article;
    }
}

CartArticle.propTypes = {
    name: PropTypes.string.isRequired
};

export default CartArticle;