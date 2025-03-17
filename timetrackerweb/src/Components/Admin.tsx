import React from 'react';
import { getAllUsers, resetPassword, addUser, deleteUser } from '../api';

export class Admin extends React.Component<{ auth: Auth }, { userName: string, users: Array<{ username: string }> }> {
  constructor(props: { auth: Auth }) {
    super(props);
    this.state = {
      userName: "",
      users: []
    }
  }

  async componentDidMount(): Promise<void> {
    await this.updateUsers();
  }

  updateUsers = async (): Promise<void> => {
    const users = await getAllUsers(this.props.auth);
    this.setState({ users: users });
  }

  updateName = (s: string): void => {
    this.setState({ userName: s });
  }

  resetUser = async (s: string): Promise<void> => {
    await resetPassword(s, this.props.auth);
  }

  deleteUser = async (s: string): Promise<void> => {
    await deleteUser(s, this.props.auth);
    await this.updateUsers();
  }

  addUser = async (): Promise<void> => {
    await addUser(this.state.userName, this.props.auth);
    await this.updateUsers();
  }


  render() {
    const users = this.state.users;
    return (
      <div>
        <h1>Admin</h1>

        <div id='userMap'>
          {users.map((value, index) => <div>
            <p key={index}>{value.username}</p>
            {value.username !== "admin" && (<>
              <button onDoubleClick={() => this.resetUser(value.username)}>Clear Password</button>
              <button onDoubleClick={() => this.deleteUser(value.username)} style={{ backgroundColor: "red" }}>Delete User</button></>)}
          </div>
          )}
        </div>
        <hr/>

        <label htmlFor='addUser'>Add User: </label>
        <input type='text' name='addUser' onChange={(e) => this.updateName(e.target.value)} />
        <button onClick={this.addUser}>Create</button>
      </div>
    );
  }
}
