import React from 'react';
import { signIn } from '../api';
import { redirect } from 'react-router-dom';

export class SignIn extends React.Component<{assignUser: (username: string, key: string) => void}, { username: string, password: string, error: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "", 
      error: ""
    }
  }

  updateUsername = (s: string): void => {
    this.setState({ username: s })
  }

  updatePassword = (s: string): void => {
    this.setState({ password: s })
  }

  login = async (): Promise<void> => {
    const obj: { key: string, worked: boolean } = await signIn({ Username: this.state.username, Pass: this.state.password });
    if (obj.worked) {
      this.props.assignUser(this.state.username, obj.key);
      redirect("/");
    } else {
      this.setState({error: "Error signing in. "});
    }
  }

  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <label htmlFor='username'>Username</label>
        <input type='text' name="username" onChange={(e) => this.updateUsername(e.target.value)} value={this.state.username} />
        <br />
        <label htmlFor='password'>Password</label>
        <input type='text' name="password" onChange={(e) => this.updatePassword(e.target.value)} value={this.state.password} />
        <br />
        <button onClick={this.login}>Login</button>
        <p color='gray'>Remember, if you're the admin, open the Docker container for the API to find the admin password. This updates 
          every time you run docker compose.
        </p>
        {this.state.error !== "" && (<p>Error: {this.state.error}</p>)}
      </div>
    );
  }
}
