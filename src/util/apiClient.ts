import axios from 'axios';

/**
 * Base URL of the majors API.
 *
 * Override per environment with NEXT_PUBLIC_API_BASE_URL (e.g. point it at
 * http://127.0.0.1:8000 for local development). The production host is the
 * fallback so a missing env var never breaks a deploy.
 */
export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-majors.aztu.edu.az'
).replace(/\/$/, '');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // Without a timeout a stalled request leaves the UI spinning forever.
    timeout: 20000,
    headers: { Accept: 'application/json' },
});

export default apiClient;

/**
 * The API could not answer (network failure, timeout, 5xx, or a body that
 * reports an error). Distinct from "no content", so the UI can say "could not
 * load" instead of "nothing has been published".
 */
export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

/** The status the backend reports in the body; endpoints disagree on the field name. */
function bodyStatus(body: unknown): number | undefined {
    if (!body || typeof body !== 'object') return undefined;
    const b = body as Record<string, unknown>;
    const raw = b.statusCode ?? b.status_code ?? b.status;
    return typeof raw === 'number' ? raw : undefined;
}

/**
 * GET a JSON body from the public API.
 *
 * Resolves to the body on success and to `null` when the API says there is
 * nothing there — HTTP 404, or HTTP 200 with a body status of 204/404, which
 * is how most endpoints report "no content". Anything else (network error,
 * timeout, 5xx, a body status of 500) rejects with ApiError. Cancellation via
 * `signal` rejects with axios' CanceledError.
 */
export async function apiGet<T = Record<string, unknown>>(
    url: string,
    signal?: AbortSignal,
): Promise<T | null> {
    let data: unknown;
    try {
        const response = await apiClient.get(url, { signal });
        data = response.data;
    } catch (err) {
        if (axios.isCancel(err)) throw err;
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        throw new ApiError(`GET ${url} failed`);
    }

    if (!data || typeof data !== 'object') throw new ApiError(`GET ${url}: unexpected body`);
    const status = bodyStatus(data);
    if (status === 204 || status === 404) return null;
    if (status !== undefined && status >= 400) throw new ApiError(`GET ${url}: status ${status}`);
    return data as T;
}

/**
 * Read every page of a paginated list endpoint.
 *
 * The list endpoints take `start`/`end` and report the full row count, but
 * default to 10 rows; a single fixed window silently truncated long lists.
 */
export async function apiGetAllPages<T>(
    buildUrl: (start: number, end: number) => string,
    pick: (body: Record<string, unknown>) => { items: T[]; total: number | undefined },
    signal?: AbortSignal,
    pageSize = 200,
    maxPages = 50,
): Promise<T[]> {
    const all: T[] = [];
    for (let page = 0; page < maxPages; page++) {
        const start = page * pageSize;
        const body = await apiGet(buildUrl(start, start + pageSize), signal);
        if (!body) break;
        const { items, total } = pick(body);
        all.push(...items);
        // `total` counts stored rows; rows without a translation are skipped
        // server-side, so compare against the window, not the items returned.
        if (typeof total !== 'number' || start + pageSize >= total) break;
    }
    return all;
}

/** Drop later duplicates of the same identity (React keys must be unique). */
export function uniqueBy<T>(items: T[], key: (item: T) => string | number | null | undefined): T[] {
    const seen = new Set<string | number>();
    const out: T[] = [];
    for (const item of items) {
        const k = key(item);
        if (k === null || k === undefined) {
            out.push(item);
            continue;
        }
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(item);
    }
    return out;
}
