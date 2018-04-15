import React, { Component } from 'react'; 
import Aux from '../../hoc/_Aux/_Aux';  
import Catalog from '../../components/Catalog/Catalog'; 
 

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar'; 

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

        //adapt server cart ajax response according to the existing articles sku
        transformServerCart(newCart){
            const availableSkus = this.state.availableSkus;
            let transformedCart = {};
            let lines = [];
            console.log("availableSkus", availableSkus);
            for(const key in newCart.lines){
                if (availableSkus.indexOf(newCart.lines[key].sku)!==-1){ 
                    console.log("sku is in " , newCart.lines[key]);
                    lines.push(newCart.lines[key]);
                }
                else 
                    console.log("extra line" , newCart.lines[key]);
                
            }
            transformedCart.lines = lines;
            transformedCart.total = newCart.total;

            console.log("transformServerCart" ,newCart );
            //update price amount
            this.setState({totalPrice:newCart.total.amount}); 
                   
            return transformedCart;
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
           let transformedCart = this.transformServerCart(newCart);
           window.localStorage.newCart = JSON.stringify(transformedCart);
        } )
        .catch( error => {
            console.log(error);
            this.setState( { error: true } );
        } );
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

    headerClickHandler(){
        console.log("click");
       
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
        
        let catalog = this.state.error ? <p>articles can't be loaded!</p> : <Spinner />;

        if ( this.state.articles ) {
            let controls = [];
            let currentArticles = this.state.articles;
            for (var i=0;i< currentArticles.length;i++){
                controls.push(currentArticles[i]);
            }
            catalog = (
                <Aux> 
                    <h1 onClick={this.headerClickHandler}>Products</h1>
                    <Catalog
                        articles = {this.state.articles}
                        articleAdded={this.addArticleHandler}
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
                {catalog}
            </Aux>
        );
    }
}

export default withErrorHandler( CatalogPage, axios );