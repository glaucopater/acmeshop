import React from 'react';

import Cart from '../../Cart/Cart';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';

const checkoutSummary = (props) => { 
    return (
        <div className={classes.CheckoutSummary}>
            <h1>Please check your order.</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Cart articles={props.cartArticles}/>
            </div>
            <Button 
                btnType="Danger"
                clicked={props.checkoutCancelled}>CANCEL</Button>
            <Button 
                btnType="Success"
                clicked={props.checkoutContinued}>CONTINUE</Button>
        </div>
    );
}

export default checkoutSummary;