import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './CompleteOrder.css';
 

class CompleteOrder extends Component {
    state = {
       
        loading: false
    }

    orderHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
      
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