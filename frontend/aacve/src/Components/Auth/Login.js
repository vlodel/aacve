import React, { Component } from 'react';
import { AppBar, Button, TextField, Typography } from '@material-ui/core';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    return (
      <div className="Login">
        <TextField
          variant="standard"
          placeholder="Email"
          margin="normal"
          required
          onChange={this.setEmail}
          value={this.state.email}
        />
        <TextField
          variant="standard"
          placeholder="Password"
          margin="normal"
          required
          type="password"
          onChange={this.setEmail}
          value={this.state.email}
        />
      </div>
    );
  }
}

//Functional component
// const Login = (props) => (
//   <div>
//     <p>Login rada</p>
//   </div>
// );

export default Login;
