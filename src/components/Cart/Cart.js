import React from 'react';

import classes from './Cart.css';
import CartArticle from './CartArticle/CartArticle';

const cart = ( props ) => {
    console.log("cart", props.articles); 
    

    let  transformedArticles = [];
    /*
    for (var key in props.articles) {
        transformedArticles.push(<CartArticle key={props.articles[key].sku} type={props.articles[key].name} /> );
    }*/

    //transformedArticles.push(<CartArticle key={100} type={"ipad"} />);

/*
    for (var i=0;i<props.articles.length;i++) {         
         const currentArticle = props.articles[i];
         console.log(currentArticle);
         transformedArticles.push(<CartArticle 
            key={currentArticle.sku+i} 
            name={currentArticle.name} 
            image={currentArticle.image} 
            price={currentArticle.price.amount}             
            />);
    }

    let test = Object.keys( props.articles )
        .map( igKey => {
            //console.log(props.articles[igKey])
            return [...Array( props.articles[igKey] )].map( ( _, i ) => {
                console.log("test ", props.articles[igKey]);
                return <CartArticle key={props.articles[igKey].sku} name={props.articles[igKey].name} />;
            });
        });*/

        /*
    for (let i=0;i<props.articles.length;i++)
    {
        var tempArticle = [];
        console.log("checkout mode", props.articles[i]);
        if (props.articles[i].length>20){
            tempArticle.push(JSON.parse(props.articles[i]));
            props.articles = tempArticle;
        }
    
    }*/

    transformedArticles = Object.keys( props.articles )
        .map( igKey => { 
            return [...Array( props.articles[igKey] )].map( ( _, i ) => {
                return <CartArticle key={props.articles[igKey].sku + igKey + i} name={props.articles[igKey].name} image={props.articles[igKey].image} />;
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
        
    if (transformedArticles.length === 0) {
        transformedArticles = <p className={classes.Message}>Please start adding articles!</p>;
    }
     
    return (
        <div className={classes.Cart}>
            {transformedArticles}
        </div>
    );
};

export default cart;