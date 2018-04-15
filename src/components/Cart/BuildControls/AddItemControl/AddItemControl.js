import React from 'react';

import classes from './AddItemControl.css';

const addItemControl = (props) => (    
    <div className={classes.AddItemControl}>
        <div className={classes.Label}>{props.name}</div>         
        <button 
            className={classes.More} 
            onClick={props.added}>+</button>
    </div>
);

export default addItemControl;