import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

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
            console.log(param[1]);
            // ['salad', '1']
            if (param[0] === 'price') {
                price = param[1];
            }  
            else {   cartArticles[param[0]] = param[1];            }
            
        }
        this.setState( { cartArticles: cartArticles, totalPrice: price } );
        console.log("componentWillMount");
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace( '/checkout/contact-data' );
    }

    render () {
        return (
            <div>
                <CheckoutSummary
                    cartArticles={this.state.cartArticles}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={(props) => (<ContactData cartArticles={this.state.cartArticles} price={this.state.totalPrice} {...props} />)} />
            </div>
        );
    }
}

export default Checkout;