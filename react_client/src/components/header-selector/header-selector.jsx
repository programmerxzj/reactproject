import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }

  state = {
    icon: null
  }

  constructor(props) {
    super(props)
    //准备需要的信息
    this.headerList = []
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: '头像' + (i + 1),
        icon: require(`./imgs/头像${i + 1}.png`)
      })
    }
  }

  selectHeader = ({icon, text}) => {
    //  更新当前组件
    this.setState({icon})
    //  更新父组件
    this.props.setHeader(text)
  }

  render() {
    const {icon} = this.state
    //头部
    const listHeader = !icon ? '请选择头像' : (
      <div>
        已选择头像:<img src={icon} alt="header"/>
      </div>
    )
    return (
      <List renderHeader={() => listHeader}>
        <Grid data={this.headerList} columnNum={5} onClick={this.selectHeader}/>
      </List>
    )
  }
}
