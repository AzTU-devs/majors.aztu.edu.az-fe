// Server-side password gate for the public site.
// The COOKIE holds an opaque token (not the password) once the visitor unlocks.
// The password itself lives only in the unlock API route (Node runtime), so it
// is never shipped to the browser or the edge middleware bundle.
export const GATE_COOKIE = "aztu_gate";
export const GATE_TOKEN = "1cfa4dba2269044928ccddad6ac6fe37";
