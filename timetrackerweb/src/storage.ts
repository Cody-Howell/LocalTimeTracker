export class Storage_Account {
  static savePair(username: string, apiKey: string): void {
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("apiKey", apiKey);
  }

  static getPair(): { username: string; apiKey: string } {
    const u = window.localStorage.getItem("username");
    const a = window.localStorage.getItem("apiKey");
    if (u !== null && a !== null) {
      return { username: u, apiKey: a };
    } else {
      return { username: "", apiKey: "" };
    }
  }

  static clearPair(): void {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("apiKey");
  }
}