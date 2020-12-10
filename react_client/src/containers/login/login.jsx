import React, {Component} from 'react'
import {
  NavBar,
  Button,
  WingBlank,
  List,
  InputItem,
  WhiteSpace
} from 'antd-mobile'

import Logo from '../../components/logo/logo'

export default class Register extends Component {
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
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <NavBar>职&nbsp;位&nbsp;招&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <InputItem placeholder='输入用户名' onChange={value => this.handleChange('username', value)}>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem placeholder='输入密码' type="password"
                       onChange={value => this.handleChange('password', value)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.login}>注&nbsp;&nbsp;&nbsp;册</Button>
            <Button onClick={this.toRegister}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
