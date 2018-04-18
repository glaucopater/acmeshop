import React from 'react';

import classes from './Order.css';

const order = ( props ) => {
    const articles = [];

    for ( let articleName in props.articles ) {
        articles.push(
            {
                name: articleName,
                amount: props.articles[articleName]
            }
        );
    }

    const articleOutput = articles.map(ig => {
        return <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ededed',
                padding: '5px'
                }}
            key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return (
        <div className={classes.Order}>
            <p>articles: {articleOutput}</p>
            <p>Price: <strong>EUR {Number.parseFloat( props.price ).toFixed( 2 )}</strong></p>
            
        </div>
    );
};

export default order;