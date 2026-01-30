export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("access_token"));
}

export function logout(): void {
  localStorage.removeItem("access_token");
}
