import React, { Component } from 'react';

import Aux from '../../hoc/_Aux/_Aux';
import Cart from '../../components/Cart/Cart';
import BuildControls from '../../components/Cart/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

/*
const ARTICLE_PRICES = {
    IPad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};*/

class Catalog extends Component {
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
        console.log(this.props);
        axios.get( '/articles.json' )
            .then( response => {
                const articles = response.data;
                this.setState( { articles: articles } );
            } )
            .catch( error => {
                console.log(error);
                this.setState( { error: true } );
            } );
    }

    updatePurchaseState ( articles ) {
        console.log("updatePurchaseState ",  articles);
        const sum = Object.keys( articles )
            .map( igKey => {
                return articles[igKey].price.amount;
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addArticleHandler = ( article ) => {
        console.log("adding " + article);
     
        let cartArticles = this.state.cartArticles;
        //let cartArticleId = article.sku +"_"+ cartArticles.length;

       //article.sku = cartArticleId;
        console.log("cartArticleId" , cartArticles.length);

        //article["cartArticleId"] = cartArticleId;
        cartArticles.push(article);

        //let updatedarticles = {            ...cartArticles        };

        //updatedarticles[article.name] = updatedCount;
        const priceAddition = article.price.amount;// ARTICLE_PRICES[article.a];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, cartArticles: cartArticles } );
        this.updatePurchaseState( cartArticles );
    }

    removeArticleHandler = ( article ) => {
        let cartArticles = this.state.cartArticles;
        if ( cartArticles.length <= 0 ) {
            return;
        }
      
        for(var i=0;i<cartArticles.length;i++){
            if (cartArticles[i].name===article.name){
                cartArticles.splice(i, 1);
            }
        }
        const updatedarticles = {
            ...this.state.cartArticles
        };

        const priceDeduction = article.price.amount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, cartArticles: cartArticles } );
        this.updatePurchaseState( updatedarticles );
    }

    purchaseHandler = () => {
        this.setState( { purchasing: true } );
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        
        const queryParams = [];
        for (let i in this.state.cartArticles) {
            const jsonData = JSON.stringify(this.state.cartArticles[i]);
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(jsonData));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
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
                    <Cart articles={this.state.cartArticles} />
                    <BuildControls
                        controls = {controls}
                        articleAdded={this.addArticleHandler}
                        articleRemoved={this.removeArticleHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
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
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {cart}
            </Aux>
        );
    }
}

export default withErrorHandler( Catalog, axios );