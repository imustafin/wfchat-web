import React from 'react';
import { auth, db } from './firebase';

class RoomButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastMessage: null
    };
  }

  subscribe = () => {
    if (this.ref) {
      this.unsubscribe();
    }

    this.ref = db.ref('chats/' + this.props.roomId);

    this.ref.on('value', snapshot => {
      const kv = snapshot.val();
      const messages = Object
        .entries(kv)
        .map(([k, v]) => ({ ...v, key: k }));

      const lastMessage = messages.length === 0 ? null : messages[messages.length - 1];

      if (!lastMessage) {
        this.setState({ lastMessage: 'No messages' });
      } else {
        const msg = lastMessage.content || (lastMessage.image ? 'Image' : null) || 'message';

        const n = 30;
        const short = msg.length > (n + 3) ? msg.slice(0, n) + '...' : msg;

        this.setState({ lastMessage: short });
      }
    });
  }

  unsubscribe = () => {
    if (ref) {
      ref.off();
    }
  }

  ref = null;

  componentDidMount() {
    this.subscribe();
  }

  async componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const className ='chatButton' + (this.props.active ? ' active' : '');

    return (
      <div
      className={className}
      onClick={this.props.onClick} >
        <div className={'chatInfo'}>
          <div className={'image'}>

          </div>

          <p className={'name'}>
            User {this.props.roomId}
          </p>

          <p className={'message'}>
            {this.state.lastMessage}
          </p>
        </div>
      </div>
    );
  }
}

export default RoomButton;
