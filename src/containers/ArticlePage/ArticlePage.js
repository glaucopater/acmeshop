import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Aux from '../../hoc/_Aux/_Aux';
import axios from '../../axios-orders';
import ArticleDetail from '../../components/ArticleDetail/ArticleDetail' 
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar'; 
 
class ArticlePage extends Component {
    state = { 
        articles: null,
        cartArticles: [],
        transformedCart: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
  
    componentDidMount() {
        const articlePath = this.props.location.pathname;       
        axios.get(`${articlePath}`)
            .then(res => {                 
                this.setState({loading: false, details: res.data});
                console.log(this.state.details);
            })
            .catch(err => {
                this.setState({loading: false});
            });

            if (typeof window.localStorage.newCart === "string"){ 
                const newCart = JSON.parse(window.localStorage.newCart);
                if (newCart){
                    console.log(newCart);               
                    this.setState({transformedCart:newCart});
                }            
            } 
        this.getArticles();
    }

    updateAvailableSkus(availableSkus){
        this.setState({availableSkus:availableSkus});
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
           window.localStorage.newCart = JSON.stringify(transformedCart);
        } )
        .catch( error => {
            console.log(error);
            this.setState( { error: true } );
        } );
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

    addArticleHandler = ( articleSku ) => {  
        let article = null;
        for (let i=0;i<this.state.articles.length;i++){
            if (this.state.articles[i].sku===articleSku){
                article = this.state.articles[i];
            }
        }
        console.log("article", article);
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
        let details = this.state.details;
        if(!details){
            details = "";
        }  
    
        let orderSummaryBar = null;
        orderSummaryBar = <OrderSummaryBar cart={this.state.transformedCart} />;
 
        return (
            <Aux>
               {orderSummaryBar}
               <ArticleDetail 
                name={details.name} 
                description={details.description} 
                image={details.image}
                details={details}
                priceAmount={0}
                priceCurrency={0}               
                articleAdded={this.addArticleHandler}
                /> 
               <Route 
                    path={this.props.match.path + '/article'} 
                    render={(props) => (<div>ArticleDetail</div>)}                     
                    />         
            </Aux>
        );
    }
}

export default ArticlePage;