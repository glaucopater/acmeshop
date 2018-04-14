import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './CompleteOrder.css';
import axios from '../../../axios-orders';

class CompleteOrder extends Component {
    state = {
       
        loading: false
    }

    orderHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        const order = {
            cartArticles: this.props.cartArticles,
            price: this.props.price,            
            deliveryMethod: 'fastest'
        }

        axios.post( 'https://react-my-burger-1ed07.firebaseio.com/orders.json', order )
            .then( response => {
                this.setState( { loading: false } );
                this.props.history.push('/');
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } );

    }

    render () {
        let form = (
            <form> 
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        return (
            <div className={classes.CompleteOrder}>                
                {form}
            </div>
        );
    }
}

export default CompleteOrder;