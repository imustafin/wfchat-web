import React from 'react';
import { auth, db } from './firebase';

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
      <>
        <h2>Showing messages for room {this.props.roomId}</h2>
        <section className="chat__body">
          <div className="messages">
            {this.state.messages.slice(0).reverse().map(message => (
              <div
                className={message.uid.length > 5 ? "message my-message" : "message"}
                key={message.key}>
                <div className="message__text">
                  <div className="message__text__content">
                    {message.content}
                  </div>
                  <div className="message__time">
                    {message.uid}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      room: '1',
    };
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ writeError: null });
    try {
      this.setState({ sending: true });
      await db.ref('chats/' + this.state.room).push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user.uid
      });
      this.setState({ sending: false });
    } catch(e) {
      this.setState({ writeError: e.message });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input
            onChange={e => this.setState({ content: e.target.value })}
            value={this.state.content}
          />
          {this.state.error && <p>Write: {this.state.writeError}</p>}

          <select
            value={this.state.room}
            onChange={e => this.setState({ room: e.target.value })}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

        </form>
        <ChatMessages
          roomId={this.state.room} />
      </div>
    );
  }
  
}

export default Chat;
