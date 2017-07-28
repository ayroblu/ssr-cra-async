import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import FirstPage from './FirstPage'
import SecondPage from './SecondPage'
import NoMatch from '../components/NoMatch'

export default class App extends Component {
  render(){
    return (
      <div>
        <h1>Server Side Rendering with Create React App - data loading</h1>
        <p>This code is on github: <a href='https://github.com/ayroblu/ssr-cra-async'>https://github.com/ayroblu/ssr-cra-async</a></p>
        <p>Medium article: <a href='https://gist.github.com/ayroblu/a6c4fcc1f397dcafe6a0ef9d46b66196'>https://gist.github.com/ayroblu/a6c4fcc1f397dcafe6a0ef9d46b66196</a></p>
        <Switch>
          <Route exact path="/" component={FirstPage}/>
          <Route path="/second" component={SecondPage}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    )
  }
}
