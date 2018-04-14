import React from 'react';

import shopLogo from '../../assets/images/shop-logo.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={shopLogo} alt="ACME" />
    </div>
);

export default logo;