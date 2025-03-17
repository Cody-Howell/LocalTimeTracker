type Auth = {
  name: string;
  key: string;
};

type TDDNames =
  | "Planning"
  | "Exploratory Activities"
  | "Testing"
  | "Refactoring"
  | "Implementation"
  | "Debugging"
  | "Other";

type TimeTrackRecord = {
  startTime: Date,
  endTime: Date,
  attended: string,
  anticipatedDuration: string,
  goal: string,
  finished: string,
  elapsedTime: number,
  additionalNotes: string,
  planning: number,
  eploration: number,
  testing: number,
  refactoring: number,
  implementation: number,
  debugging: number,
  other: number,
  primaryProject: boolean
}

