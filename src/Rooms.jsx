import React from 'react';
import { auth, db, storage } from './firebase';
import { sortBy, reverse } from 'lodash';
import RoomButton from './RoomButton';

class Rooms extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      biggestMessage: {}
    };

    this.getRef = this.getRef.bind(this);
  }

  getRef() {
    return db.ref('chats/');
  }

  subscribe() {
    try {
      this.getRef().on('value', snapshot => {
        const kv = snapshot.val();
        const toMerge = {};
        const messages = Object
          .entries(kv)
          .forEach(([k, v]) => {
            var mx = this.state.biggestMessage[k];
            Object.keys(v).forEach(id => {
              if (!mx || id > mx) {
                mx = id
              }
            });
            
            if (mx) {
              toMerge[k] = mx;
            }
          });

        this.setState({biggestMessage: {...this.state.biggestMessage, ...toMerge}});
      });
    } catch(e) {
      console.log(e);
    }
  }


  async componentDidMount() {
    this.subscribe();
  }

  render() {
    const rooms = sortBy(Object.entries(this.state.biggestMessage), ([k, v]) => v);
    return (
      <>
        {reverse(rooms).map(([x, _]) => (
          <RoomButton
            key={x}
            onClick={() => this.props.roomSelected(x)}
            active={this.props.selectedRoom === x}
            roomId={x}/>
        ))}
      </>
    );
  }
}

export default Rooms;
