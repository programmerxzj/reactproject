import React, {Component} from 'react'
import {
  NavBar,
  Button,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio
} from 'antd-mobile'

import Logo from '../../components/logo/logo'

const ListItem = List.Item

export default class Register extends Component {
  state = {
    username: '',
    password: '',
    password2: '',
    type: 'laoban'
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  toLogin = () => {
    this.props.history.replace('/login')
  }
  register = () => {
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
            <InputItem placeholder='输入确认密码' type="password"
                       onChange={value => this.handleChange('password2', value)}>确认密码:</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>用户类型:</span>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'dashen'} onClick={() => {
                this.handleChange('type', 'dashen')
              }}>大神</Radio>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'laoban'} onClick={() => {
                this.handleChange('type', 'laoban')
              }}>老板</Radio>
            </ListItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
