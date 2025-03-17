using System.Security.Cryptography;
using System.Text;

public static class PasswordGenerator {
    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";

    public static string GenerateRandomPassword(int length = 12) {
        var password = new StringBuilder();
        using var rng = RandomNumberGenerator.Create();
        var buffer = new byte[length];

        rng.GetBytes(buffer);

        for (int i = 0; i < length; i++) {
            var index = buffer[i] % Chars.Length;
            password.Append(Chars[index]);
        }

        return password.ToString();
    }
}