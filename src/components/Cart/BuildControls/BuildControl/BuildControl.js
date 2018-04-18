import React from 'react';

import classes from './BuildControl.css';

const buildControl = (props) => (    
    <div className={classes.BuildControl}>
        <img className={classes.Image} src={props.image} alt={props.image}/>
        <div className={classes.Label}>{props.quantity} x {props.name}</div>
        <button 
            className={classes.Less} 
            onClick={props.removed} 
            disabled={props.disabled}>-</button>
        <button 
            className={classes.More} 
            onClick={props.added}>+</button>
    </div>
);

export default buildControl;