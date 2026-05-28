const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export class ServerConnection {
  private static async fetchServer(
    method: HttpMethod,
    path: string,
    payload?: any,
  ) {
    const response = await fetch(`${backendUrl}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  }

  static async get(path: string) {
    return await this.fetchServer("GET", path);
  }

  static async post(path: string, payload?: any) {
    return await this.fetchServer("POST", path, payload);
  }

  static async patch(path: string, payload?: any) {
    return await this.fetchServer("PATCH", path, payload);
  }

  static async delete(path: string) {
    return await this.fetchServer("DELETE", path);
  }
}
