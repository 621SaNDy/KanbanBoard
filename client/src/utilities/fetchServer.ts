export async function fetchServer(path: string) {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
  const response = await fetch(`${backendUrl}${path}`);
  const data = await response.json();
  return data;
}
