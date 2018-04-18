import React  from 'react';
import { Route } from 'react-router-dom';
import Page from '../Page/Page'
import Aux from '../../hoc/_Aux/_Aux';
import axios from '../../axios-config';
import ArticleDetail from '../../components/ArticleDetail/ArticleDetail' 
import OrderSummaryBar from '../../components/Cart/OrderSummaryBar/OrderSummaryBar'; 
 
class ArticlePage extends Page {

    constructor(props) {
         super(props);
         this.state = { articles: null,
            cartArticles: [],
            transformedCart: null,
            totalPrice: 0,
            purchasable: false,
            purchasing: false,
            loading: false,
            error: false,
            availableSkus: [],
            details: null
        }
     }
     
  
    componentDidMount() {
        const articlePath = this.props.location.pathname;       
        axios.get(`${articlePath}`)
            .then(res => {                 
                this.setState({loading: false, details: res.data}); 
            })
            .catch(err => {
                this.setState({loading: false});
            });
            if (typeof window.localStorage.newCart === "string"){ 
                const newCart = JSON.parse(window.localStorage.newCart);
                if (newCart){            
                    this.setState({transformedCart:newCart});
                    this.updatePurchaseState( this.state.cartArticles );
                }            
            } 
        this.getArticles();
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