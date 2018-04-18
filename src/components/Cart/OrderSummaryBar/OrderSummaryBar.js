import React, { Component } from 'react'; 
import classes from './OrderSummaryBar.css';
  
class OrderSummaryBar extends Component {
 
    render () {    

        let totalItems = 0;
        let totalPrice = 0;

        //get history of cart:
        //it can be used instead of cookies
        //it can be used between different pages 

        let newCart = null;
        if (this.props.cart )// && this.props.cart && typeof this.props.cart !== "undefined")
        {
            newCart = this.props.cart;
        }  
        if(newCart){
            for (let line in newCart.lines){
                totalItems += newCart.lines[line].quantity;
            }                         
            totalPrice = newCart.total.amount; 
        } 
        return (
            <div className={classes.OrderSummaryBar}>                
                <div className={classes.TotalItems}>Total items: <strong>{totalItems}</strong></div>
                <div className={classes.TotalPrice}>Total: <strong> {totalPrice}</strong></div>  
            </div>
        );
    }
}

export default OrderSummaryBar;