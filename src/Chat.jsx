import React from 'react';
import { auth, db, storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import ChatMessages from './ChatMessages';
import RoomButton from './RoomButton';


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
    const chats = ['1', '2', '3'];

    return (
      <section className={'mainApp'}>
        <div className={'leftPanel'}>
          <div className={'chats'}>
            {chats.map(x => (
              <RoomButton
                onClick={() => this.setState({ room: x })}
                active={this.state.room === x}
                roomId={x}/>
            ))}
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
            <label for={'file'} className={'attach'}>
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
