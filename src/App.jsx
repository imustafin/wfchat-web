import React from 'react';
import { hot } from 'react-hot-loader';

import LoginForm from './LoginForm';
import Chat from './Chat';

import { auth } from './firebase';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading</h1>;
    }

    if (!this.state.authenticated) {
      return <LoginForm />;
    }

    return (
      <div>
        <h1>Hi, {auth().currentUser.email}</h1>
        <Chat />
      </div>
    );
  }
}

export default hot(module)(App);
