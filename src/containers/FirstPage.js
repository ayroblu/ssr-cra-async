import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as userActions from '../actions/user'
import { Link } from 'react-router-dom'
import './FirstPage.css'

class FirstPage extends Component {
  async componentWillMount(){
    this.state = {text: 'loading'}
    
    const {staticContext} = this.props
    let loading = false
    if (!staticContext || !staticContext.data.firstPage) {
      if (!staticContext && window.DATA.firstPage) {
        loading = window.DATA.firstPage
      } else {
        loading = this._getData()
        console.log('inner loading', loading)
      }
      
      if (staticContext) {
        staticContext.data.firstPage = loading
        return
      }
    } else if (staticContext){
      const {text} = staticContext.data.firstPage
      this.setState({text})
      return
    }
    console.log('loading', loading)
    const {text} = await loading
    this.setState({text})
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
