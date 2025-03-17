using Npgsql;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using TimeTrackerAPI;
using TimeTrackerAPI.Classes;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration["DOTNET_DATABASE_STRING"] ?? throw new InvalidOperationException("Connection string for database not found.");
Console.WriteLine("Connection String: " + connString);
var dbConnector = new DatabaseConnector(connString);
builder.Services.AddSingleton<IDbConnection>(provider =>
{
    return dbConnector.ConnectWithRetry();
});
builder.Services.AddSingleton<DBService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseMiddleware<IdentityMiddleware>();
app.UseRouting();


app.MapGet("/api/health", () => "Health Check");
app.MapGet("/api/users", (DBService service) => service.GetAllUsers());
app.MapPost("/api/signin", (DBService service, User user) =>
{
    var passHash = CustomHash(user.Pass);
    List<User> users = service.GetAllUsers().ToList();
    if (users.Any(u => u.Username == user.Username && u.Pass == passHash)) {
        string key = PasswordGenerator.GenerateRandomPassword(20);
        service.UpdateApiKey(user.Username, key);
        return key;
    } else {
        return "";
    }
});
app.MapPost("/api/signin/update", (DBService service, User user) =>
{
    var passHash = CustomHash(user.Pass);
    user.Pass = passHash;
    service.UpdateUser(user);
    return "Success";
});

app.MapPost("/api/signin/add", (DBService service, string username) =>
{
    var passHash = CustomHash("password");
    service.AddUser(new User { Username = username, Pass = passHash });
    return "Success";
});

app.MapGet("/api/signin/reset/{user}", (DBService service, string user) =>
{
    var passHash = CustomHash("password");
    service.UpdateUser(new User { Username = user, Pass = passHash });
});

app.MapGet("/api/signin/delete/{user}", (DBService service, string user) =>
{
    service.DeleteUser(user);
});

app.MapPost("/api/record/add", (DBService service, TimeTrackRecord record) =>
{
    service.AddRecord(record);
});

app.MapGet("/api/record/get", (DBService service, string user, bool primary) =>
{
    return service.GetRecords(user, primary);
});

app.MapPost("/api/record/remove", (DBService service, DateTime startTime, DateTime endTime) =>
{
    service.RemoveRecord(new TimeTrackRecord { StartTime = startTime, EndTime = endTime });
});

app.MapFallbackToFile("index.html");

// Seed the database with an admin user
using (var scope = app.Services.CreateScope()) {
    var service = scope.ServiceProvider.GetRequiredService<DBService>();
    string seedString = PasswordGenerator.GenerateRandomPassword();
    Console.WriteLine("Admin Password: " + seedString);
    service.UpdateUser(new User { Username = "admin", Pass = CustomHash(seedString) });
    service.UpdateApiKey("admin", ""); // Should also refresh admin token every time
}

app.Run();


static string CustomHash(string s) {
    return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(s)));
}