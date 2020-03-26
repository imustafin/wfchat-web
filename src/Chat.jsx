import React from 'react';
import { auth, db } from './firebase';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null
    };
  }

  async componentDidMount() {
    this.setState({ readError: null });

    try {
      db.ref('chats').on('value', snapshot => {
        const kv = snapshot.val();
        const chats = Object
              .entries(kv)
              .map(([k, v]) => ({ ...v, key: k }));
        this.setState({ chats });
      });
    } catch(e) {
      this.setState({ readError: e.message });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ writeError: null });
    try {
      this.setState({ sending: true });
      await db.ref('chats').push({
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
          {this.state.sending && <p>Sending...</p>}
          {this.state.error && <p>Write: {this.state.writeError}</p>}
        </form>
        {this.state.readError && <p>Read: {this.state.readError}</p>}
        <div className={'chats'}>
          {this.state.chats.slice(0).reverse().map(chat => (
            <p key={chat.key}>{chat.content}</p>
          ))}
        </div>
      </div>
    );
  }
  
}

export default Chat;
