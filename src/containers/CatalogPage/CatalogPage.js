import React, { Component } from 'react';

import Aux from '../../hoc/_Aux/_Aux';
import Cart from '../../components/Cart/Cart'; 
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

 

class CatalogPage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        articles: null,
        cartArticles: [],
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {  
      this.getArticles();
    }

    getArticles(){ 
        axios.get( '/catalog' )
        .then( response => {
            const articles = response.data.articles;
            this.setState( { articles: articles } );
        } )
        .catch( error => {
            console.log(error);
            this.setState( { error: true } );
        } );
    }
 

    render () { 
        const disabledInfo = {
            ...this.state.articles
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let cart = this.state.error ? <p>articles can't be loaded!</p> : <Spinner />;

        if ( this.state.articles ) {
            let controls = [];
            let currentArticles = this.state.articles;
            for (var i=0;i< currentArticles.length;i++){
                controls.push(currentArticles[i]);
            }
            cart = (
                <Aux>
                    <h1>Products Catalog</h1>
                    <Cart articles={this.state.articles} />
                </Aux>
            );
            orderSummary = <OrderSummary
                articles={this.state.cartArticles}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        if ( this.state.loading ) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {cart}
            </Aux>
        );
    }s
}

export default withErrorHandler( CatalogPage, axios );