import React from 'react';
import { getAllUsers, resetPassword, addUser, deleteUser, getRecordsWithQuery, removeRecord } from '../api';

export class Admin extends React.Component<{ auth: Auth }, { userName: string, users: Array<{ username: string }>, records: Array<TimeTrackRecord> }> {
  constructor(props: { auth: Auth }) {
    super(props);
    this.state = {
      userName: "",
      users: [],
      records: []
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

  removeRow = async (index: number): Promise<void> => {
    const value = this.state.records[index];
    await removeRecord(value.startTime, value.endTime, this.props.auth);
    this.getAllRecords();
  }

  getAllRecords = async (): Promise<void> => {
    const records: Array<TimeTrackRecord> = [];
    for (const val of await getRecordsWithQuery("", true, this.props.auth)) {
      records.push(val);
    }
    for (const val of await getRecordsWithQuery("", false, this.props.auth)) {
      records.push(val);
    }
    this.setState({ records: records });
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
        <hr />

        <label htmlFor='addUser'>Add User: </label>
        <input type='text' name='addUser' onChange={(e) => this.updateName(e.target.value)} />
        <button onClick={this.addUser}>Create</button>

        <hr />
        <h2>Records</h2>
        <button onDoubleClick={this.getAllRecords}>Get All Records (double-click)</button>
        <p>Double click the delete option to remove it from the database.</p>
        {this.state.records.map((value, index) => <>
          <button style={{backgroundColor: "red"}} onDoubleClick={() => this.removeRow(index)}>Delete</button>
          <p>Start time: {value.startTime.toLocaleString()}, End time: {value.endTime.toLocaleString()}, 
            Attendees: {value.attended}, primary project: {value.primaryProject ? "true" : "false"}
          </p>
        </>)}

      </div>
    );
  }
}
