import React from 'react';

import classes from './Catalog.css';
import ArticleCard from './ArticleCards/ArticleCard/ArticleCard';

const catalog = ( props ) => { 

    let transformedArticleCards = [];
    
    transformedArticleCards = Object.keys( props.articles )
        .map( igKey => { 
            return [...Array( props.articles[igKey] )].map( ( _, i ) => {
                return <ArticleCard 
                key={props.articles[igKey].sku + igKey + i}
                sku={props.articles[igKey].sku} 
                name={props.articles[igKey].name} 
                image={props.articles[igKey].image}
                priceAmount={props.articles[igKey].price.amount}
                priceCurrency={props.articles[igKey].price.currency}    
                added={() => props.articleAdded(props.articles[igKey])}            
                 />;
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
        
    if (transformedArticleCards.length === 0) {
        transformedArticleCards = <h2>Please start adding articles!</h2>;
    }
     
    return (
        <div className={classes.Catalog}>
            {transformedArticleCards}
        </div>
    );
};

export default catalog;