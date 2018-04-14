import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Aux from '../../hoc/_Aux/_Aux';
import axios from '../../axios-orders';
import ArticleDetail from '../../components/ArticleDetail/ArticleDetail'
 
 
class ArticlePage extends Component {
    state = { 
        loading: true,
        details: null
    }
  
    componentDidMount() {
        const articlePath = this.props.location.pathname;
        axios.get(`${articlePath}`)
            .then(res => {                 
                this.setState({loading: false, details: res.data});
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render () {
        let details = this.state.details;
        if(!details){
            details = "";
        } 
 
        return (
            <Aux>
               <ArticleDetail 
               name={details.name} 
               description={details.description} 
               image={details.image}
               priceAmount={0}
               priceCurrency={0}
                /> 
               <Route 
                    path={this.props.match.path + '/article'} 
                    render={(props) => (<div>ArticleDetail</div>)} />         
            </Aux>
        );
    }
}

export default ArticlePage;