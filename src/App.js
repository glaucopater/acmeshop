import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout'; 
import CartPage from './containers/CartPage/CartPage';
import Checkout from './containers/Checkout/Checkout'; 
import ArticlePage from './containers/ArticlePage/ArticlePage';
import CatalogPage from './containers/CatalogPage/CatalogPage';



class App extends Component {
  render () {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/cart" component={CartPage} />   
            <Route path="/article" component={ArticlePage} />   
            <Route path="/catalog" component={CatalogPage} />             
            <Route path="/" exact component={CatalogPage} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
