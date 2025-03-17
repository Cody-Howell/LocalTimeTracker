import React from 'react';
import { Storage_Account } from '../storage';
import { redirect } from 'react-router-dom';
import { updatePassword } from '../api';

type AccountProps = { assignUser: (username: string, key: string) => void, auth: Auth };
type AccountState = {
  newPassword: string,
  passwordAgain: string,
  message: string
}

export class Account extends React.Component<AccountProps, AccountState> {
  state = {
    newPassword: "",
    passwordAgain: "",
    message: ""
  }

  updateStateWithInput = (key: "nP" | "pA", value: string): void => {
    switch (key) {
      case "nP": this.setState({ newPassword: value }); break;
      case "pA": this.setState({ passwordAgain: value }); break;
    }
  }

  signOut = () => {
    Storage_Account.clearPair();
    this.props.assignUser("", "");
    redirect("/");
  }

  updatePassword = () => {
    if (this.state.newPassword === this.state.passwordAgain) {
      updatePassword(this.state.newPassword, this.props.auth);
      this.setState({ message: "Password updated! " });
    } else {
      this.setState({ message: "Passwords don't match." });
    }
  }

  render() {
    return (
      <div>
        <h1>Account</h1>
        <h2>{this.props.auth.name}</h2>
        <button onClick={this.signOut}>Sign Out</button>

        <h2>Update Password</h2>
        <input type='password' placeholder='New Password' onChange={(e) => this.updateStateWithInput("nP", e.target.value)} />
        <input type='password' placeholder='New Password Again' onChange={(e) => this.updateStateWithInput("pA", e.target.value)} />
        <button onClick={this.updatePassword}>Update</button>

        {this.state.message !== "" && (<p>{this.state.message}</p>)}
      </div>
    );
  }
}
