import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'
import { Link } from 'react-router-dom'
import './FirstPage.css'

class FirstPage extends Component {
  async componentWillMount(){
    this.state = {text: 'loading'}
    
    this._handleData('firstPage')
  }
  async _handleData(key){
    const {staticContext} = this.props
    if (staticContext && staticContext.data[key]){
      const {text} = staticContext.data[key]
      this.setState({text})
    } else if (staticContext){
      staticContext.data[key] = this._getData()
    } else if (!staticContext && window.DATA[key]){
      const {text} = window.DATA[key]
      this.setState({text})
      window.DATA[key] = null
    } else if (!staticContext) {
      const {text} = await this._getData()
      this.setState({text})
    }
  }
  async _getData(){
    const {text} = await new Promise(y=>setTimeout(()=>{
      y({text: 'hi'}) // This is probably where you'd make an api call
    },1000))
    return {text}
  }
  render() {
    const b64 = this.props.staticContext ? 'wait for it' : window.btoa('wait for it')
    const {text} = this.state
    return (
      <div className='bold'>
        <h2>First Page</h2>
        <p>{`Email: ${this.props.user.email}`}</p>
        <p>{`b64: ${b64}`}</p>
        <p>{`text: ${text}`}</p>
        <Link to={'/second'}>Second</Link>
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
