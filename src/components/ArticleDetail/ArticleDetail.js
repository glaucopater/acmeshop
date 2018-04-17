import React from 'react';
 
import classes from './ArticleDetail.css';

function createMarkup(htmlCode) {
    return {__html: htmlCode};
  }

 
const ArticleDetail = (props) => (
    <div className={classes.ArticleDetail} >
        <h2>{props.details.name}</h2>
        <div>
            <img className={classes.Image} src={props.details.image} alt={props.details.name}/>
        </div>   
        <div className={classes.Price}>{props.details.priceAmount} {props.details.priceCurrency}</div>
    
        <div className={classes.Button}  onClick={() => props.articleAdded(props.details.sku)}><span>+</span> ADD TO CART</div>
        <div dangerouslySetInnerHTML={createMarkup(props.details.description)} />      
    </div>
)

export default ArticleDetail;