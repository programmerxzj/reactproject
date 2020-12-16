import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {sendMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {
  state = {
    content: '',
    isShow: false//是否显示emoji表情
  }

  componentWillMount() {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
      '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '💋']
    this.emojis = emojis.map(emoji => ({text: emoji}))
  }

  componentDidMount() {
    //初始化显示
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //更新信息显示
    window.scrollTo(0, document.body.scrollHeight)
  }

  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if (isShow) {
      // 手动派发resize事件,解决表情列表显示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  handleSend = () => {
    //收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    //发送请求
    if (content) {
      this.props.sendMsg({from, to, content})
    }
    //  清除数据
    this.setState({
      content: '',
      isShow: false
    })

  }

  render() {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat
    // 计算当前聊天的chatId
    const meId = user._id
    if (!users[meId]) { // 如果还没有获取数据, 直接不做任何显示
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [meId, targetId].sort().join('_')

    // 对chatMsgs进行过滤
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
    // 得到目标用户的header图片对象
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null
    return (
      <div id='chat-page'>
        <NavBar
          className='stick-header'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
        >{users[targetId].username}</NavBar>
        <List style={{marginTop: 50, marginBottom: 50}}>
          {
            msgs.map(msg => {
              if (targetId === msg.from) {
                //  对方发给我的
                return (
                  <Item key={msg._id} thumb={targetIcon}>
                    {msg.content}
                  </Item>
                )
              } else {
                return (
                  <Item key={msg._id} className='chat-me' extra='我'>
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>

        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span onClick={this.toggleShow} style={{marginRight: 5}}>💋</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {this.state.isShow ? (
            <Grid
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => {
                this.setState({content: this.state.content + item.text})
              }}
            />
          ) : null}

        </div>
      </div>
    )
  }
}


export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg}
)(Chat)
