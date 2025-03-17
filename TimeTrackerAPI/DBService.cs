using Dapper;
using System.Data;
using TimeTrackerAPI.Classes;

namespace TimeTrackerAPI;

public class DBService(IDbConnection conn) {
    public IEnumerable<User> GetAllUsers() {
        var OrderId = "select p.username, p.pass, p.apikey from people p order by 1 asc";
        return conn.Query<User>(OrderId);
    }

    public void AddUser(User user) {
        var OrderId = "insert into people (username, pass) values (@username, @pass)";
        conn.Execute(OrderId, user);
    }

    public void UpdateUser(User user) {
        var OrderId = "update people set pass = @pass where username = @username";
        conn.Execute(OrderId, user);
    }

    public void UpdateApiKey(string username, string newKey) {
        var OrderId = "update people set apikey = @key where username = @username";
        conn.Execute(OrderId, new { username, key = newKey});
    }

    public void DeleteUser(string user) {
        var OrderId = "delete from people where username = @user";
        conn.Execute(OrderId, new { user });
    }

    public void AddRecord(TimeTrackRecord record) {
        record.StartTime -= new TimeSpan(6, 0, 0);
        record.EndTime -= new TimeSpan(6, 0, 0);
        var OrderId = "INSERT INTO public.records (starttime,endtime,attended,anticipatedduration,goal,finished,elapsedtime,additionalnotes,planning,eploration,testing,refactoring,\"implementation\",debugging,other,primaryproject) VALUES (@starttime,@endtime,@attended,@anticipatedduration,@goal,@finished,@elapsedtime,@additionalnotes,@planning,@eploration,@testing,@refactoring,@implementation,@debugging,@other,@primaryproject);";
        conn.Execute(OrderId, record);
    }

    public IEnumerable<TimeTrackRecord> GetRecords(string user = "") {
        user = '%' + user + '%';
        var OrderId = "select starttime,endtime,attended,anticipatedduration,goal,finished,elapsedtime,additionalnotes,planning,eploration,testing,refactoring,implementation,debugging,other,primaryproject from records where attended like @user order by 1";
        return conn.Query<TimeTrackRecord>(OrderId, new { user });
    }
}
