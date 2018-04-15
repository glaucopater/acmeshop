import React from 'react';

import classes from './Cart.css';
import CartArticle from './CartArticle/CartArticle';

const cart = ( props ) => { 

    let transformedArticles = [];
    
    transformedArticles = Object.keys( props.articles )
        .map( igKey => { 
            return [...Array( props.articles[igKey] )].map( ( _, i ) => {
                return <CartArticle 
                key={props.articles[igKey].sku + igKey + i}
                sku={props.articles[igKey].sku} 
                name={props.articles[igKey].name} 
                image={props.articles[igKey].image}
                priceAmount={props.articles[igKey].price.amount}
                priceCurrency={props.articles[igKey].price.currency}
                
                 />;
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
        
    if (transformedArticles.length === 0) {
        transformedArticles = <h2>Please start adding articles!</h2>;
    }
     
    return (
        <div className={classes.Cart}>
            {transformedArticles}
        </div>
    );
};

export default cart;