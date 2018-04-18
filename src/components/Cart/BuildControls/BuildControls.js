import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';
 

const buildControls = (props) => (
    <div className={classes.BuildControls}>


        {props.controls.map(ctrl => (
            <BuildControl 
                key={ctrl.name} 
                name={ctrl.name}
                image={ctrl.image}
                quantity={ctrl.quantity}
                added={() => props.articleAdded(ctrl)}
                removed={() => props.articleRemoved(ctrl)}
                disabled={props.disabled[ctrl.name]} />
        ))}

        {props.totalPrice===0 && <p>Your cart is empty</p>}

        {props.totalPrice!==0 &&
        <div className={classes.CurrentInfo}>
            <p className={classes.CurrentPrice}>Current Price: <strong>{props.totalPrice.toFixed(2)}</strong></p>
            <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>PROCEED TO CHECKOUT</button>
        </div>}
        
        
    </div>
);

export default buildControls;