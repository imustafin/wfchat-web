import React from 'react';
import { auth } from './firebase';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ error: null });
    try {
      await auth().signInWithEmailAndPassword(
        this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          Email:
          <input
            type={'text'}
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })} />
        </label>

        <label>
          Password:
          <input
            type={'password'}
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })} />
        </label>

        {this.state.error && <p>{this.state.error}</p>}

        <button type={'submit'}>Login</button>
      </form>
    );
  }
}


export default LoginForm;
