import React from 'react';
import { auth, db } from './firebase';

class RoomButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  subscribe = () => {
    db.ref('lastRead/' + this.props.roomId).on('value', snapshot => {
      this.setState({lastRead: snapshot.val()});
    });

    db.ref('chats/' + this.props.roomId).on('value', snapshot => {
      const kv = snapshot.val();
      const messages = Object
        .entries(kv)
        .map(([k, v]) => ({ ...v, key: k }));

      console.log(this.props.roomId, messages);
      this.setState({ messages: messages });
    });
  }

  renderLastMessage() {
    const { messages } = this.state;
    const lastMessage = messages.length === 0 ? null : messages[messages.length - 1];

    if (!lastMessage) {
      return 'No messages';
    }

    const msg = lastMessage.content || (lastMessage.image ? 'Image' : null) || 'message';

    const n = 30;
    const short = msg.length > (n + 3) ? msg.slice(0, n) + '...' : msg;

    return short;
  }


  unsubscribe = () => {
    if (ref) {
      // ref.off();
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  render() {
    const className ='chatButton' + (this.props.active ? ' active' : '');

    const unreadReal = this.state.messages.filter(x => x.key > this.state.lastRead).length;

    const unread = (unreadReal && unreadReal > 0 && unreadReal) || false;

    return (
      <div
      className={className}
      onClick={this.props.onClick} >
        <div className={'chatInfo'}>
          <div className={'image'}></div>

          <p className={'name'}>
            User {this.props.roomId}
          </p>

          <p className={'message'}>
            {this.renderLastMessage()}
          </p>
        </div>

        <div className={'status normal'}>
          {unread && <p className={'count'}>{unread}</p>}

        </div>
      </div>
    );
  }
}

export default RoomButton;
