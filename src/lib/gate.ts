// Server-side password gate for the public site.
//
// The cookie holds an opaque token, never the password itself. Both values are
// overridable per environment so the repository does not have to carry the
// production secret; the fallbacks keep existing deployments working.
export const GATE_COOKIE = "aztu_gate";
export const GATE_TOKEN = process.env.SITE_GATE_TOKEN || "1cfa4dba2269044928ccddad6ac6fe37";
