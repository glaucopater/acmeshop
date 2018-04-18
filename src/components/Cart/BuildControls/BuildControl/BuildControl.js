import React from 'react';

import classes from './BuildControl.css';

const buildControl = (props) => (    
    <div className={classes.BuildControl}>
        <img className={classes.Image} src={props.image} alt={props.name}/>
        <div className={classes.Label}> 
            <a className={classes.Link} href={"/article/"+props.sku}>{props.name}</a> 
        </div>          
        <div className={classes.SubTotals} >
            {props.quantity} x {props.price.amount} {props.price.currency} 
        </div> 
        <div className={classes.Buttons} > 
            <button 
                className={classes.Less} 
                onClick={props.removed} 
                disabled={props.disabled}>-</button>
            <button 
                className={classes.More} 
                onClick={props.added}>+</button>
        </div> 
    </div>
);

export default buildControl;