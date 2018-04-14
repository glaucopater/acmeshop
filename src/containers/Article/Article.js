import React, { Component } from 'react';


import Aux from '../../hoc/_Aux/_Aux';
import axios from '../../axios-orders';
import ArticleDetail from '../../components/ArticleDetail/ArticleDetail'
 
 
class Article extends Component {
    state = { 
        loading: true,
        details: null
    }

    componentDidMount() {
        axios.get('http://challenge.monoqi.net/article/199203')
            .then(res => {  
                console.log(res.data);
                console.log(res.data);
                
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
               <ArticleDetail name={details.name} description={details.description} image={details.image} /> 
            </Aux>
        );
    }
}

export default Article;