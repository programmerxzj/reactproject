import React, {Component} from 'react'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
// import {reqUser} from "../../api";

const Item = TabBar.Item

class NavFooter extends Component {
  static propTypes = {
    navList: PropTypes.array.isRequired
  }

  render() {
    let {navList} = this.props
    //过滤hide为true的数组
    navList = navList.filter(nav => !nav.hide)
    const path = this.props.location.pathname
    return (
      <TabBar>
        {
          navList.map((nav) => (
            <Item key={nav.path}
                  title={nav.text}
                  icon={{uri: require(`./imgs/${nav.icon}.png`)}}
                  selectedIcon={{uri: require(`./imgs/${nav.icon}-selected.png`)}}
                  selected={path === nav.path}
                  onPress={() => this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    )
  }
}

// 让非路由组件可以访问到路由组件的API
export default withRouter(NavFooter)
