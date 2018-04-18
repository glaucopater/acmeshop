import React, { Component } from 'react';

import Aux from '../../hoc/_Aux/_Aux';


import BuildControls from '../../components/Cart/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar';

import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import classes from './CartPage.css';

 

class CartPage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        articles: null,
        cartArticles: [],
        transformedCart: null,
        availableSkus: [],
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {  

        if (typeof window.localStorage.newCart === "string"){ 
            const newCart = JSON.parse(window.localStorage.newCart);
            console.log("componentDidMount",  newCart);
            if (newCart){           
                this.setState({transformedCart:newCart
                    , totalPrice:newCart.total.amount
                });
            }            
        } 
      this.getArticles();
      
    }

    restoreCartArticles(){ 
        let cartSkus = [];
        let cartLines = []; 

        let updateCartArticles = this.state.cartArticles;
        for(let i=0;i<this.state.transformedCart.lines.length;i++){
            cartLines.push({sku:this.state.transformedCart.lines[i].sku,
                            quantity:this.state.transformedCart.lines[i].quantity}
                        );
            cartSkus.push(this.state.transformedCart.lines[i].sku);
        } 

        for(let i=0;i<this.state.articles.length;i++){
            let currentArticle = this.state.articles[i];
            let skuIndex = cartSkus.indexOf(currentArticle.sku);
            if (skuIndex!==-1)
            { 
                for(let j=0;j<cartLines[skuIndex].quantity;j++){ 
                    currentArticle.quantity = cartLines[skuIndex].quantity;                    
                    updateCartArticles.push(currentArticle);
                }
            } 
          
        }
 
        this.setState({cartArticles:updateCartArticles});
    }

    getArticles(){
        axios.get( '/catalog' )
        .then( response => {
            const articles = response.data.articles;
            this.setState( { articles: articles } ); 
            this.restoreCartArticles();

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
        let transformedCart = {};
        let lines = []; 
        for(const key in newCart.lines){
            if (availableSkus.indexOf(newCart.lines[key].sku)!==-1){  
                lines.push(newCart.lines[key]);
            }             
        }
        transformedCart.lines = lines;
        transformedCart.total = newCart.total;
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
        const uniqueSkus = [...new Set(cartArticles.map(item => item.sku))];
        for (let i=0;i<uniqueSkus.length;i++){
            const qty = this.getArticleQuantityBySku(uniqueSkus[i]);
            lines.push({"sku":uniqueSkus[i],"quantity":qty});  
        } 

        cart.lines = lines;
        this.updateAvailableSkus(uniqueSkus);
        axios.put( '/cart',cart )
        .then( response => {
            const newCart = response.data; 
            console.log("newCart ", newCart);
            let transformedCart = this.transformServerCart(newCart);
            this.setState({transformedCart:transformedCart});


            //TEST
            //this.restoreCartArticles();            
            //this.setState({cartArticles:[...new Set(this.state.cartArticles)]});

            window.localStorage.newCart = JSON.stringify(transformedCart);
        } )
        .catch( error => {
            console.log(error);
            this.setState( { error: true } );
        } );
    }

    updatePurchaseState ( articles ) { 
        console.log(articles);
        const sum = Object.keys( articles )
            .map( igKey => {
                return articles[igKey].price.amount;
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );

        this.setState( { purchasable: sum > 0 } );

        console.log("purchasable ",sum, " ",  this.state.purchasable);
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
        this.updateCart();
    }

    purchaseHandler = () => {
        this.setState( { purchasing: true } );
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        console.log('To be continued...'); 
        delete window.localStorage.newCart; 
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

        if ( this.state.cartArticles ) {
             
            //unique articles 
            //after loading component
            let controls = [...new Set(this.state.cartArticles)];  
          
            /*
            var ca = this.state.cartArticles;
            var countedNames = ca.reduce(function (allNames.sku, sku) { 
                if (sku in allNames) {
                allNames[sku]++;
                }
                else {
                allNames[sku] = 1;
                }
                return allNames;
            }, {});
            console.log(countedNames);

            console.log("unique sku");
            for(let i=0;i<controls.length;i++)
            {
                console.log(controls[i]);
            }
 
            
            let tempCartArticles = this.state.cartArticles;
            for(let i=0;i<tempCartArticles.length;i++)
            {
                //look for new qty 
                
                for(let index in this.state.transformedCart.lines){
                    if (this.state.transformedCart.lines[index].sku===tempCartArticles[i].sku){
                        tempCartArticles[i].quantity = this.state.cartArticles[i].quantity;
                    }
                } 
                
            }*/

            console.log("controls", controls);
            
 
            cart = (
                <Aux>
                    <h1 className={classes.PageTitle}>Shopping Cart</h1>
                    <div className={classes.CartPage}>                    
                    <BuildControls
                        controls = {controls}
                        articleAdded={this.addArticleHandler}
                        articleRemoved={this.removeArticleHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        totalPrice={this.state.totalPrice} />
                    </div>
                    <div>

                    </div>
                </Aux>
            );
            orderSummary = <OrderSummary
                articles={this.state.cartArticles}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;           
            
            orderSummaryBar = <OrderSummaryBar cart={this.state.transformedCart} />;
                
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