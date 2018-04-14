import React from 'react';
 
import classes from './ArticleDetail.css';

function createMarkup(htmlCode) {
    return {__html: htmlCode};
  }

 
const ArticleDetail = (props) => (
    <div className={classes.ArticleDetail} >
        <h2>{props.name}</h2>
        <div>
            <img className={classes.Image} src={props.image} alt={props.name}/>
        </div>   
        <div className={classes.Price}>{props.priceAmount} {props.priceCurrency}</div>
        <div dangerouslySetInnerHTML={createMarkup(props.description)} />          
    </div>
)

export default ArticleDetail;