import React from 'react';
import { auth, db, storage } from './firebase';
import ScrollToBottom from 'react-scroll-to-bottom';

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    this.getRef = this.getRef.bind(this);
  }

  getRef(roomId) {
    return db.ref('chats/' + roomId);
  }

  subscribe(roomId) {
    try {
      this.getRef(roomId).on('value', snapshot => {
        const kv = snapshot.val();
        const messages = Object
              .entries(kv)
              .map(([k, v]) => ({ ...v, key: k }));
        this.setState({ messages });
      });
    } catch(e) {
      console.log(e);
    }
  }

  unsubscribe(roomId) {
    this.getRef(roomId).off();
  }

  async componentDidMount() {
    this.subscribe(this.props.roomId);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.roomId != this.props.roomId) {
      this.unsubscribe(prevProps.roomId);

      this.setState({ messages: [] });
      this.subscribe(this.props.roomId);
    }
  }

  async componentWillUnmount() {
    db.ref('chats').off();
  }

  render() {
    return (
      <ScrollToBottom className="convHistory userBg">
        {this.state.messages.map(message => (
          <div
            className={message.uid === this.props.userUid ? "msg messageSent" : "msg messageReceived"}
            key={message.key}>
            {
              message.image ?
              <>
                <img
                  style={{width: '300px'}}
                  src={message.image}/>
                <span className="timestamp">
                  {message.uid}
                </span>
              </>
              :
              <>
                {message.content}
                <span className="timestamp">
                  {message.uid}
                </span>
              </>
            }
          </div>
        ))}
      </ScrollToBottom>
    );
  }
}

export default ChatMessages;
