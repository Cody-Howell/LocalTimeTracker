import React from 'react'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { SignIn } from './Components/SignIn';
import { Admin } from './Components/Admin';
import { PrimaryPage } from './Components/PrimaryPage';
import { Account } from './Components/Account';
import { Storage_Account } from './storage';
import AuthContext from './Context';

class App extends React.Component<Record<string, never>, { user: { name: string, key: string } }> {
  constructor() {
    super({});
    this.state = {
      user: {
        name: "",
        key: ""
      }
    }
  }

  componentDidMount(): void {
    const pair = Storage_Account.getPair();
    this.updateUser(pair.username, pair.apiKey);
  }

  updateUser = (username: string, key: string): void => {
    const newUser = this.state.user;
    newUser.name = username;
    newUser.key = key;
    this.setState({ user: newUser });
    Storage_Account.savePair(newUser.name, newUser.key);

  }

  render() {
    return (
      <>
        <AuthContext.Provider value={this.state.user}>
          <BrowserRouter>
            <Sidebar name={this.state.user.name} />
            <Routes>
              {this.state.user.name !== "" ?
                (<>
                  <Route path="/" element={<PrimaryPage auth={this.state.user}/>} />
                  <Route path="/account" element={<Account assignUser={this.updateUser} auth={this.state.user} />} />
                </>) : (
                  <Route path="/" element={<SignIn assignUser={this.updateUser} />} />)}

              {this.state.user.name === "admin" && (
                <Route path='/admin' element={<Admin auth={this.state.user} />} />
              )}

              <Route path='*' element={<MissingPage />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </>
    )
  }
}

class Sidebar extends React.Component<{ name: string }, Record<string, never>> {
  render() {
    return (
      <div id='sidebar'>
        {this.props.name === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
        {this.props.name === "" ? (
          <Link to="/">Sign In</Link>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/account">Account</Link>
          </>
        )}
      </div>
    )
  }
}

class MissingPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Missing Page</h1>
        <p>Not sure where you wanted to go. <Link to="/">Want to go back? </Link></p>
      </div>
    )
  }
}

export default App
