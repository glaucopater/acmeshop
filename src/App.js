import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout'; 
import Catalog from './containers/Catalog/Catalog';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Article from './containers/Article/Article';


class App extends Component {
  render () {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/Catalog" component={Catalog} />   
            <Route path="/Article" component={Article} />                                 
            <Route path="/orders" component={Orders} />
            <Route path="/" exact component={Catalog} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
