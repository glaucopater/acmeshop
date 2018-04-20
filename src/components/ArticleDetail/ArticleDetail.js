import React from 'react';
 
import classes from './ArticleDetail.css';

function createMarkup(htmlCode) {
    return {__html: htmlCode};
  }

 
const ArticleDetail = (props) => (
    <div className={classes.ArticleDetail} >
        <h1 className={classes.PageTitle}>{props.details.name}</h1>
        <div className={classes.ImageContainer}>
            <img className={classes.Image} src={props.details.image} alt={props.details.name}/>
        </div>   
        <div className={classes.Price}>{props.details.priceAmount} {props.details.priceCurrency}</div>
        <button className={classes.Button} 
                onClick={() => props.articleAdded(props.details.sku)}
                >ADD TO CART</button>
        <div dangerouslySetInnerHTML={createMarkup(props.details.description)} />      
    </div>
)

export default ArticleDetail;