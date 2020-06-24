import React from 'react';
import { auth, db, storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import ChatMessages from './ChatMessages';
import Rooms from './Rooms';


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

    this.sendMessage(this.state.content, null);
    this.setState({content: ''});
  }

  async sendMessage(text, image) {
    this.setState({ writeError: null });
    try {
      this.setState({ sending: true });
      await db.ref('chats/' + this.state.room).push({
        content: text,
        image: image,
        timestamp: Date.now(),
        uid: this.state.user.uid
      });
      this.setState({ sending: false });
    } catch(e) {
      this.setState({ writeError: e.message });
    }
  }

  fileUpload(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    storage.ref('/images/' + uuidv4())
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL()
      .then(url => this.sendMessage(url, url)));
  }

  render() {
    return (
      <section className={'mainApp'}>
        <div className={'leftPanel'}>
          <div className={'chats'}>
            <Rooms
              roomSelected={x => this.setState({room: x})}
              selectedRoom={this.state.room}
            />
          </div>
        </div>
        <div className={'rightPanel'}>
          <div className={'topBar'}>
            <div className={'rightSide'}>
              
            </div>
            <div className={'leftSide'}>
              <p className={'chatName'}>
                {this.state.room}
                <span>{this.state.room}</span>
              </p>
              <p className={'chatStatus'}>
                
              </p>
            </div>
          </div>
          <ChatMessages
            roomId={this.state.room}
            userUid={this.state.user.uid} />
          <div className={'replyBar'}>
            <input
              style={{
                width: '1px',
                height: '1px',
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: -1
              }}
              id={'file'}
              type="file"
              onChange={e => this.fileUpload(e)}/>
            <label htmlFor={'file'} className={'attach'}>
              <span className={'material-icons d45'}>
                attach_file
              </span>
            </label>
            <form onSubmit={e => this.handleSubmit(e)}>
              <input
                type={'text'}
                className={'replyMessage'}
                placeholder={'Type your message...'}
                onChange={e => this.setState({ content: e.target.value })}
                value={this.state.content}
              />


            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Chat;
