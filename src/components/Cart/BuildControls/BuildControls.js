import React from 'react'; 
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';
 

const buildControls = (props) => { 
    return (
    <div className={classes.SuperCartContainer}>
        <div className={classes.LeftColumn}> 
            <div className={classes.BuildControls}>
                {props.totalPrice===0 && <p className={classes.EmptyCart}>Your cart is empty</p>}
                {props.controls.map(ctrl => (
                    <BuildControl 
                        key={ctrl.name} 
                        name={ctrl.name}
                        image={ctrl.image}
                        quantity={ctrl.quantity}
                        sku={ctrl.sku}
                        price={ctrl.price}
                        added={() => props.articleAdded(ctrl)}
                        removed={() => props.articleRemoved(ctrl)}
                        disabled={props.disabled[ctrl.name]} />
                ))}
            </div> 
        </div> 
        <div className={classes.RightColumn}>  
            {props.totalPrice!==0 && 
            <div className={classes.CurrentInfo}>
                <p className={classes.CurrentPrice}>Current Price: <strong>{props.totalPrice.toFixed(2)}</strong></p>
                <button 
                className={classes.OrderButton}
                disabled={!props.purchasable}
                onClick={props.ordered}>PROCEED TO CHECKOUT</button>
            </div>}
        </div> 
    </div> 
)};

export default buildControls;