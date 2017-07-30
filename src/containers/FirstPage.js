import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import Butter from 'buttercms'

import * as api from '../api'
import * as userActions from '../actions/user'
import './FirstPage.css'

const butter = Butter('b60a008584313ed21803780bc9208557b3b49fbb')

class FirstPage extends Component {
  async componentWillMount(){
    this.state = {text: 'loading'}
    
    this._handleData('firstPage')
  }
  async _handleData(key){
    const {staticContext} = this.props

    if (staticContext && staticContext.data[key]){
      const {text, data} = staticContext.data[key]
      this.setState({text, data})
      staticContext.head.push(
        <meta name="description" content={"Some description: "+text}/>
      )
    } else if (staticContext){
      staticContext.data[key] = this._getData()
    } else if (!staticContext && window.DATA[key]){
      const {text, data} = window.DATA[key]
      this.state = {...this.state, text, data}
      window.DATA[key] = null
    } else if (!staticContext) {
      const {text, data} = await this._getData()
      this.setState({text, data})
    }
  }
  async _getData(){
    const {staticContext} = this.props
    const myApi = staticContext ? staticContext.api : api
    const resp = await butter.post.list()
    const {data} = resp.data
    const {text} = await myApi.getMain()
    return {text, data}
  }
  render() {
    const b64 = this.props.staticContext ? 'wait for it' : window.btoa('wait for it')
    const {text, data} = this.state
    return (
      <div className='bold'>
        <h2>First Page</h2>
        <p>{`Email: ${this.props.user.email}`}</p>
        <p>{`b64: ${b64}`}</p>
        <p>{`text: ${text}`}</p>
        <Link to={'/second'}>Second</Link>
        {data && 
        <div>
          {data.map(d=>(
            <p key={d.slug}>{d.title}</p>
          ))}
        </div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstPage)
