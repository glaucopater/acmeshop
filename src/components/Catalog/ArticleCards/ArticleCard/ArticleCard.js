import React from 'react';

import classes from './ArticleCard.css'; 

const articleCard = (props) => { 
    
    
    const imageStyle = {
        backgroundImage: 'url(' + props.image + ')' 
    } 

    return (   
    <div className={classes.ArticleCard} style={imageStyle}> 
          <footer>    
                <div className={classes.ProductName}>
                    <a className={classes.Link} href={"/article/"+props.sku}>{props.name}</a> 
                </div>  
                <div className={classes.Price}>{props.priceAmount}  {props.priceCurrency}</div>
                <div className={classes.Button}  onClick={props.added}><span>+</span> ADD TO CART</div>
         </footer>   
    </div>
    )
}

export default articleCard;