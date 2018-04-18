import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import CompleteOrder from './CompleteOrder/CompleteOrder';

class Checkout extends Component {
    state = {
        cartArticles: null,
        price: 0
    }

    componentWillMount () {
        const query = new URLSearchParams( this.props.location.search ); 
        const cartArticles = {};
        let price = 0;
        for ( let param of query.entries() ) { 
            if (param[0] === 'price') {
                price = param[1];
            }  
            else {   cartArticles[param[0]] = param[1];            }
            
        }
        this.setState( { cartArticles: cartArticles, totalPrice: price } ); 
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace( '/checkout/complete-order' );
    }

    render () {
        return (
            <div>
                <CheckoutSummary
                    cartArticles={this.state.cartArticles}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
                <Route 
                    path={this.props.match.path + '/complete-order'} 
                    render={(props) => (<CompleteOrder cartArticles={this.state.cartArticles} price={this.state.totalPrice} {...props} />)} />
            </div>
        );
    }
}

export default Checkout;