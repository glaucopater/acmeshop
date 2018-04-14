import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}> 
        <NavigationItem link="/catalog" exact>Catalog</NavigationItem>  
        <NavigationItem link="/cart" exact>Cart</NavigationItem>    
    </ul>
);

export default navigationItems;