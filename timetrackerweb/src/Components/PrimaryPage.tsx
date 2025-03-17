import React from 'react';
import { getAllUsers, getRecordsWithQuery, postRecord } from '../api';

type PrimaryPageProps = {
  auth: Auth
}

type PrimaryPageState = {
  people: Array<string>,
  selectedPeople: Array<string>,
  selectedTDD: string,
  lastUpdatedTime: Date | null,
  properties: Array<{ type: TDDNames, time: number }>,
  currentProperty: string,
  longTextAreas: Array<string>,
  timeStarted: Date | null,
  primary: boolean,
  query: Array<TimeTrackRecord>,
  username: string
}

export class PrimaryPage extends React.Component<PrimaryPageProps, PrimaryPageState> {
  constructor(props: PrimaryPageProps) {
    super(props);
    this.state = {
      people: [],
      selectedPeople: [],
      selectedTDD: "",
      lastUpdatedTime: null,
      properties: [],
      currentProperty: "",
      longTextAreas: ["", "", "", ""],
      timeStarted: null,
      primary: true,
      query: [],
      username: ""
    }
  }

  async componentDidMount(): Promise<void> {
    const users: Array<{ username: string }> = await getAllUsers(this.props.auth);
    const names: Array<string> = [];
    for (const person of users) {
      if (person.username !== "admin")
        names.push(person.username);
    }
    this.setState({ people: names });

    const tdd: Array<TDDNames> = ["Planning", "Exploratory Activities", "Testing", "Refactoring", "Implementation", "Debugging", "Other"];
    const newProps: Array<{ type: TDDNames, time: number }> = [];
    for (const name of tdd) {
      newProps.push({ type: name, time: 0 });
    }
    this.setState({ properties: newProps });
  }

  togglePerson = (person: string): void => {
    const state: Array<string> = this.state.selectedPeople;
    if (state.includes(person)) {
      state.splice(state.indexOf(person), 1);
    } else {
      state.push(person);
    }
    state.sort();
    this.setState({ selectedPeople: state });
  }

  startNewSection = (type: TDDNames): void => {
    if (this.state.timeStarted === null) this.setState({ timeStarted: new Date });

    if (this.state.lastUpdatedTime === null) {
      this.setState({ lastUpdatedTime: new Date(), currentProperty: type });
    } else {
      const seconds = (Date.now() - this.state.lastUpdatedTime.valueOf()) / 1000;
      const properties = this.state.properties;
      for (let i = 0; i < properties.length; i++) {
        if (properties[i].type === this.state.currentProperty) {
          properties[i].time += seconds;
        }
      }

      // If the same, stop the timer.  
      if (type === this.state.currentProperty) {
        this.setState({ lastUpdatedTime: null, currentProperty: "", properties: properties });
      } else {
        this.setState({ lastUpdatedTime: new Date(), currentProperty: type, properties: properties });
      }
    }
  }

  updateLongTextIndex = (index: number, string: string): void => {
    const values = this.state.longTextAreas;
    values[index] = string;
    this.setState({ longTextAreas: values });
  }

  updateIndividualProperties = (index: number, time: string): void => {
    const values = this.state.properties;
    values[index].time = Number.parseFloat(time) * 60;
    console.log(values[index].time);
    this.setState({ properties: values });
  }

  togglePrimary = (): void => {
    this.setState({ primary: !this.state.primary })
  }

  submitToServer = async (): Promise<void> => {
    const obj: TimeTrackRecord = {
      startTime: this.state.timeStarted === null ? new Date() : this.state.timeStarted,
      endTime: new Date(),
      attended: this.state.selectedPeople.join(','),
      anticipatedDuration: this.state.longTextAreas[0],
      goal: this.state.longTextAreas[1],
      finished: this.state.longTextAreas[2],
      elapsedTime: this.state.properties.reduce((prev, curr) => prev + curr.time, 0),
      additionalNotes: this.state.longTextAreas[3],
      planning: this.state.properties[0].time,
      eploration: this.state.properties[1].time,
      testing: this.state.properties[2].time,
      refactoring: this.state.properties[3].time,
      implementation: this.state.properties[4].time,
      debugging: this.state.properties[5].time,
      other: this.state.properties[6].time,
      primaryProject: this.state.primary
    };
    await postRecord(obj, this.props.auth);
  }

  updateQuerySelector = async (s: string): Promise<void> => {
    this.setState({ username: s });
  }

  runQuery = async (): Promise<void> => {
    const values = await getRecordsWithQuery(this.state.username, this.props.auth);
    this.setState({ query: values });
  }

  getBackgroundColorPeople = (person: string): string => {
    const people: Array<string> = this.state.selectedPeople;
    if (people.includes(person)) {
      return "#004a00"
    } else {
      return "#000000"
    }
  }

  getBackgroundColorProperty = (type: string): string => {
    if (type === this.state.currentProperty) {
      return "#004a00";
    } else {
      return "#000000";
    }
  }

  render() {
    const nameRenderer: React.ReactNode[] = this.state.people.map((value, index) =>
      <p key={index + "person"}
        onClick={() => this.togglePerson(value)}
        style={{
          backgroundColor: this.getBackgroundColorPeople(value),
          userSelect: "none",
          cursor: "pointer",
          padding: "5px",
          border: "1px solid white",
          borderRadius: "10px"
        }}
      >{value}</p>
    );

    const propertyRenderer: React.ReactNode[] = this.state.properties.map((value, index) =>
      <p key={index + "person"}
        onDoubleClick={() => this.startNewSection(value.type)}
        style={{
          backgroundColor: this.getBackgroundColorProperty(value.type),
          userSelect: "none",
          cursor: "pointer",
          padding: "5px",
          border: "1px solid white",
          borderRadius: "10px"
        }}
      >{value.type}</p>
    );

    const timeStarted: Date | null = this.state.timeStarted;

    return (
      <div>
        <h1>Timer</h1>
        <p>Welcome! This is my timer page. It's designed to hold timers for who attends what where, and also our
          Personal Software Process' TDD time tracking to help us estimate. Here, get all the users who attended the
          meeting, and start a planning, exploratory activities, testing, refactoring, implementation, debugging, or other timer.
          You can get all saved values from the database in a CSV format for both project tracking and time estimation.
        </p>
        <hr />

        <div style={{
          display: 'grid',
          gridTemplateColumns: "2fr 1fr"
        }}>
          <div>
            <h2>Display</h2>
            <label htmlFor='primary'>Primary Project</label>
            <input type='checkbox' id='primary' onClick={this.togglePrimary} defaultChecked />
            <p>Select the participants of the group: </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {nameRenderer}
            </div>
            <p>Double click to start/stop a type: </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {propertyRenderer}
            </div>
            <div className='inputAreas'>
              <label htmlFor='anticipatedDuration'>Anticipated Duration</label>
              <input type='text' name='anticipatedDuration' onChange={(e) => this.updateLongTextIndex(0, e.target.value)} /> <br />
            </div>
            <div className='inputAreas'>
              <label htmlFor='goal'>Goal/Focus</label>
              <textarea name='goal' onChange={(e) => this.updateLongTextIndex(1, e.target.value)} /> <br />
            </div>
            <div className='inputAreas'>
              <label htmlFor='knownCompletion'>How You Know You're Done</label>
              <textarea name='knownCompletion' onChange={(e) => this.updateLongTextIndex(2, e.target.value)} /> <br />
            </div>          <div className='inputAreas'>
              <label htmlFor='additionalNotes'>Additional Notes</label>
              <textarea name='additionalNotes' onChange={(e) => this.updateLongTextIndex(3, e.target.value)} /> <br />
            </div>
          </div>
          <div>
            <h2>Check/Submit</h2>
            <p>Primary project: {this.state.primary ? "true" : "false"}</p>
            {timeStarted !== null &&
              (<p>Starting timestamp: {timeStarted?.toLocaleString()}</p>)
            }
            <p>People: {this.state.selectedPeople.join(',')}</p>
            <hr />
            <p>Adam's Properties: </p>
            {this.state.properties.map((value, index) => <p key={index + "displayProps"}>{value.type}: <input type='number' value={Math.round(value.time / 60 * 100) / 100} onChange={(e) => this.updateIndividualProperties(index, e.target.value)} /></p>)}
            <p>Actual duration (in minutes): {Math.round(this.state.properties.reduce((prev, curr) => prev + curr.time, 0) / 60 * 100) / 100}</p>
            <hr />
            <p>Exp. Duration: {this.state.longTextAreas[0]}</p>
            <p>Goal: {this.state.longTextAreas[1]}</p>
            <p>How You Know: {this.state.longTextAreas[2]}</p>
            <p>Notes: {this.state.longTextAreas[3]}</p>
          </div>

        </div>
        <button style={{ width: "100%" }} onClick={this.submitToServer}>Submit</button>
        <hr />
        <h2>Query</h2>
        <select onChange={(e) => this.updateQuerySelector(e.target.value)}>
          <option value={""}>_</option>
          {this.state.people.map((value) => <option value={value}>{value}</option>)}
        </select>
        <button onDoubleClick={this.runQuery}>Run Query</button>
        <TimeRecordDisplay records={this.state.query} />
      </div>
    );
  }
}

class TimeRecordDisplay extends React.Component<{ records: Array<TimeTrackRecord> }, Record<string, never>> {
  copyToClipboard = () => {
    const headersArray: Array<string> = [
      "startTime",
      "endTime",
      "attended",
      "anticipatedDuration",
      "goal",
      "finished",
      "elapsedTime",
      "additionalNotes",
      "planning",
      "eploration",
      "testing",
      "refactoring",
      "implementation",
      "debugging",
      "other",
      "primaryProject"];
    const content: Array<string> = [];

    // get content
    for (let i = 0; i < this.props.records.length; i++) {
      const localArray: Array<string> = [];
      const value = this.props.records[i];
      localArray.push(value.startTime.toLocaleString());
      localArray.push(value.endTime.toLocaleString());
      localArray.push(value.attended);
      localArray.push(value.anticipatedDuration);
      localArray.push(value.goal);
      localArray.push(value.finished);
      localArray.push(value.elapsedTime.toString());
      localArray.push(value.additionalNotes);
      localArray.push(value.planning.toString());
      localArray.push(value.eploration.toString());
      localArray.push(value.testing.toString());
      localArray.push(value.refactoring.toString());
      localArray.push(value.implementation.toString());
      localArray.push(value.debugging.toString());
      localArray.push(value.other.toString());
      localArray.push(value.primaryProject.toString());
      content.push(localArray.join(';'));
    }

    navigator.clipboard.writeText(headersArray.join(';') + "\n" + content.join("\n"));
  }

  render() {
    return (<>
      <button onClick={this.copyToClipboard}>Copy CSV to clipboard</button>
      {this.props.records.map((value, index) => <>
        <div style={{ display: 'grid', gridTemplateColumns: "1fr 1fr 1fr 1fr" }} key={index + "TRD"}>
          <h2>Starting date: {new Date(value.startTime).toLocaleString()}</h2>
          <p>Attendees: {value.attended}</p>
          <p>Goals: {value.goal}</p>
          <p>Total Time: {Math.round(value.elapsedTime / 60 * 100) / 100}</p>
        </div>
      </>)}
    </>)
  }
}
