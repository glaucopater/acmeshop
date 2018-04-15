import React, { Component } from 'react'; 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
 

class CartManager extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        articles: null,
        cartArticles: [],
        availableSkus: [],
        totalPrice: 0,
        itemsQuantity: 0,
        loading: false,
        error: false
    }

    componentDidMount () {   
      let cart =  JSON.parse(window.localStorage.newCart);
      let qty = 0;
      for (let line in cart.lines){
        qty += cart.lines[line].quantity;
        console.log(cart.lines[line].quantity);
      }
      
      this.setState({         
          totalPrice:cart.total.amount,
          itemsQuantity:qty});
    }
 
    render () {
        return ( <div>Cart Items {this.state.itemsQuantity} {this.state.totalPrice}</div>);
    }
 
}


export default withErrorHandler( CartManager, axios );

