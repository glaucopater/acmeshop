import React from 'react';

import classes from './ArticleCard.css';

const articleCard = (props) => (   
    <div className={classes.ArticleCard}>
            <img className={classes.ArticleCardImage} 
            src={props.image} 
            alt={props.name}
            />  
            <div className={classes.ArticleCardInfo}>          
                <a className={classes.ArticleCardLink} href={"/article/"+props.sku}>{props.name}</a>
                <div className={classes.ArticleCardPrice}>
                 {props.priceAmount}  {props.ArticleCardCurrency}</div>
                <button 
                className={classes.ArticleCardButton} 
                onClick={props.added}>Add to cart</button>
            </div>
    </div>
);

export default articleCard;