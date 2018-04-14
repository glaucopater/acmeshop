import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

//const controls = [    { label: 'IPad', type: 'ipad' } ];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {props.controls.map(ctrl => (
            <BuildControl 
                key={ctrl.name} 
                name={ctrl.name}
                added={() => props.articleAdded(ctrl)}
                removed={() => props.articleRemoved(ctrl)}
                disabled={props.disabled[ctrl.name]} />
        ))}
        <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
    </div>
);

export default buildControls;