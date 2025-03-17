namespace TimeTrackerAPI.Classes;

public class TimeTrackRecord {
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Attended { get; set; }
    public string AnticipatedDuration { get; set; }
    public string Goal { get; set; }
    public string Finished { get; set; }
    public string AdditionalNotes { get; set; }
    public double ElapsedTime { get; set; }
    public double Planning { get; set; }
    public double Eploration{ get; set; }
    public double Testing { get; set; }
    public double Refactoring { get; set; }
    public double Implementation { get; set; }
    public double Debugging { get; set; }
    public double Other { get; set; }
    public bool PrimaryProject { get; set; }

}
