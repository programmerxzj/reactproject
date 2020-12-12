import React, {Component} from 'react'
import {
  NavBar,
  Button,
  WingBlank,
  List,
  InputItem,
  WhiteSpace
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  toRegister = () => {
    this.props.history.replace('/register')
  }
  login = () => {
    // console.log(this.state);
    this.props.login(this.state)
  }

  render() {
    const {redirectTo, msg} = this.props.user
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>职&nbsp;位&nbsp;招&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg ? <p className='error-msg'>{msg}</p> : null}
          <List>
            <InputItem placeholder='输入用户名' onChange={value => this.handleChange('username', value)}>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem placeholder='输入密码' type="password"
                       onChange={value => this.handleChange('password', value)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
            <Button onClick={this.toRegister}>未有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {login}
)(Login)
