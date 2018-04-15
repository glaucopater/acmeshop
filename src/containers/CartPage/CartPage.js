import React, { Component } from 'react';

import Aux from '../../hoc/_Aux/_Aux';
import Cart from '../../components/Cart/Cart';
import BuildControls from '../../components/Cart/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar';

import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

 

class CartPage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        articles: null,
        cartArticles: [],
        availableSkus: [],
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

    getArticleQuantityBySku(sku){
        let counter = 0;
        const cartArticles = this.state.cartArticles;
        for (let i=0;i<cartArticles.length;i++){ 
            if (cartArticles[i].sku===sku){
                counter++;
            }
        }
        return counter;
    }

    //adapt server cart response according to the existing articles sku
    transformServerCart(newCart){
        const availableSkus = this.state.availableSkus;
        console.log("availableSkus", availableSkus);
        for(const key in newCart.lines){
            if (availableSkus.indexOf(newCart.lines[key].sku)!==-1){ 
                console.log("sku is in " , newCart.lines[key]);
            }
            else 
                console.log("extra line" , newCart.lines[key]);
            
        }
        //update price amount
        this.setState({totalPrice:newCart.total.amount});
        
    }

    updateAvailableSkus(availableSkus){
        this.setState({availableSkus:availableSkus});
    }

    updateCart(){
        const cartArticles = this.state.cartArticles;
        let cart = {};
        let lines = [];
  
        let articlesSkus=[];

        for (let i=0;i<cartArticles.length;i++){
            articlesSkus.push(cartArticles[i].sku);           
        } 
        console.log("articlesSkus ", articlesSkus);  

        const uniqueSkus = [...new Set(cartArticles.map(item => item.sku))];
        console.log("uniqueSkus ", uniqueSkus);
        //this.updateAvailableSkus(uniqueSkus);
        console.log("availableSkus ", uniqueSkus);

        for (let i=0;i<uniqueSkus.length;i++){
            const qty = this.getArticleQuantityBySku(uniqueSkus[i]);
            lines.push({"sku":uniqueSkus[i],"quantity":qty});  
        } 

        cart.lines = lines;

        console.log("cart", cart);
        this.updateAvailableSkus(uniqueSkus);

        axios.put( '/cart',cart )
        .then( response => {
            const newCart = response.data;
            console.log("newCart",newCart);
           // this.setState( { totalPrice:newCart.total.amount  } );
           this.transformServerCart(newCart);
        } )
        .catch( error => {
            console.log(error);
            this.setState( { error: true } );
        } );
    }

    updatePurchaseState ( articles ) { 
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
    
        let cartArticles = this.state.cartArticles; 
        cartArticles.push(article); 
        const priceAddition = article.price.amount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, cartArticles: cartArticles } );
        this.updatePurchaseState( cartArticles );
        this.updateCart();
    }

    removeArticleHandler = ( article ) => {
        let cartArticles = this.state.cartArticles;
        if ( cartArticles.length <= 0 ) {
            return;
        }
      
        for(var i=0;i<cartArticles.length;i++){
            if (cartArticles[i].name===article.name){
                cartArticles.splice(i, 1);
                break;
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
        console.log('To be continued...');
        /*
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
        });*/
 
    }

    render () {
        const disabledInfo = {
            ...this.state.articles
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let orderSummaryBar = null;
        
        let cart = this.state.error ? <p>articles can't be loaded!</p> : <Spinner />;

        if ( this.state.articles ) {
            let controls = [];
            let currentArticles = this.state.articles;
            for (var i=0;i< currentArticles.length;i++){
                controls.push(currentArticles[i]);
            }
            cart = (
                <Aux>
                    <h1>My Cart</h1>
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
                
            orderSummaryBar = <OrderSummaryBar
            articles={this.state.cartArticles}
            price={this.state.totalPrice} />;
                
        }
        if ( this.state.loading ) {
            orderSummary = <Spinner />;
        } 
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {orderSummaryBar}
                {cart}
            </Aux>
        );
    }
}

export default withErrorHandler( CartPage, axios );