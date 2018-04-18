import React from 'react';  
import Page from '../Page/Page'
import Aux from '../../hoc/_Aux/_Aux';
import BuildControls from '../../components/Cart/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-config';
import classes from './CartPage.css';

 

class CartPage extends Page {
    constructor(props) {
        super(props);
        this.state = { 
        articles: null,
           cartArticles: [],
           transformedCart: null,
           totalPrice: 0,
           purchasable: false,
           purchasing: false,
           loading: false,
           error: false,
           availableSkus: []
        }
    }
 

    componentDidMount () {  
        if (typeof window.localStorage.newCart === "string"){ 
            const newCart = JSON.parse(window.localStorage.newCart);
            if (newCart){           
                this.setState({transformedCart:newCart
                    ,totalPrice:newCart.total.amount
                });
            }   
            this.updatePurchaseState( newCart.lines );          
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
            let transformedCart = this.transformServerCart(newCart);
            this.setState({transformedCart:transformedCart});
 
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
        this.props.history.replace( '/catalog' );
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

            for(let i=0;i<controls.length;i++){
                controls[i].quantity = this.getArticleQuantityBySku(controls[i].sku);
            }

            //controls = this.state.transformedCart.lines;
 
            cart = (
                <Aux>
                    <h1 className={classes.PageTitle}>Shopping Cart</h1>
                    <div className={classes.CartPage}>                    
                    <BuildControls
                        controls = {controls}
                        temp = {this.state.cartArticles}
                        articleAdded={this.addArticleHandler}
                        articleRemoved={this.removeArticleHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        totalPrice={this.state.totalPrice} />
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