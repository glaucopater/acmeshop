import React, { Component } from 'react'; 
import classes from './OrderSummaryBar.css';
  
class OrderSummaryBar extends Component {
 
    render () {    

        let totalItems = 0;
        let totalPrice = 0;

        //get history of cart:
        //it can be used instead of cookies
        //it can be used between different pages
        if (window.localStorage.newCart) {
            let cart =  JSON.parse(window.localStorage.newCart);
            for (let line in cart.lines){
                totalItems += cart.lines[line].quantity;
            }                         
            totalPrice = cart.total.amount; 
        } 

        
 
        if(this.props.price!==0){
            totalItems = totalItems + this.props.articles.length;
            totalPrice = totalPrice + this.props.price;
        }
        return (
            <div className={classes.OrderSummaryBar}>                
                <div  className={classes.TotalItems}>Total items: {totalItems}</div>
                <div  className={classes.TotalPrice}><strong>Total Price: {totalPrice}</strong></div>  
            </div>
        );
    }
}

export default OrderSummaryBar;