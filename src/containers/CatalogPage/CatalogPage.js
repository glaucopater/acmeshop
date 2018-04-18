import React from 'react'; 
import Page from '../Page/Page'
import Aux from '../../hoc/_Aux/_Aux';  
import Catalog from '../../components/Catalog/Catalog';   
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar'; 
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-config';
import classes from './CatalogPage.css';
 

class CatalogPage extends Page {
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
                this.setState({transformedCart:newCart});
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
 

    render () { 
        const disabledInfo = {
            ...this.state.articles
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        } 
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
                    <h1 className={classes.PageTitle} onClick={this.headerClickHandler}>Products</h1>
                    <Catalog
                        articles = {this.state.articles}
                        articleAdded={this.addArticleHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            ); 
            orderSummaryBar = <OrderSummaryBar cart={this.state.transformedCart} />;

        }
        
        return (
            <Aux> 
                {orderSummaryBar}
                {catalog}
            </Aux>
        );
    }
}

export default withErrorHandler( CatalogPage, axios );