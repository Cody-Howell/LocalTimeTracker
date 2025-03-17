async function getResponse(path: string, auth: Auth): Promise<string> {
  const url = "/api";
  try {
    const response = await fetch(url + path, {
      headers: {
        "User": auth.name,
        "ApiKey": auth.key,
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
}

async function postResponse(path: string, obj: any, auth: Auth): Promise<string> {
  const url = "/api";
  try {
    const response = await fetch(url + path, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        "User": auth.name,
        "ApiKey": auth.key,
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
}

export async function seeHealthCheck(): Promise<void> {
  console.log(await getResponse("/health", {name: "", key: ""}));
}

export async function signIn(obj: { Username: string; Pass: string }): Promise<{ key: string; worked: boolean }> {
  const result = await postResponse("/signin", obj, { name: "", key: "" });
  if (result !== "") {
    return { key: result, worked: true };
  } else {
    return { key: "", worked: false };
  }
}

export async function getAllUsers(auth: Auth): Promise<Array<{ username: string }>> {
  const vals = await getResponse("/users", auth);
  return JSON.parse(vals);
}

export async function resetPassword(s: string, auth: Auth): Promise<void> {
  await getResponse("/signin/reset/" + s, auth);
}

export async function deleteUser(s: string, auth: Auth): Promise<void> {
  await getResponse("/signin/delete/" + s, auth);
}

export async function addUser(s: string, auth: Auth): Promise<void> {
  await postResponse("/signin/add?username=" + s, {}, auth);
}

export async function updatePassword(s: string, auth: Auth): Promise<void> {
  await postResponse("/signin/update", {Username: auth.name, Pass: s}, auth);
}

export async function postRecord(s: TimeTrackRecord, auth: Auth): Promise<void> {
  await postResponse("/record/add", s, auth);
}

export async function getRecordsWithQuery(name: string, auth: Auth): Promise<Array<TimeTrackRecord>> {
  return JSON.parse(await getResponse("/record/get?user=" + name, auth));
}
