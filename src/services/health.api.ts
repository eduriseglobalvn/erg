/**
 * Health Check API — Monitoring endpoints
 * Ref: FE_CHANGELOG.md §7 — Health Check Endpoints (NEW)
 */

export interface HealthResponse {
    status: 'ok';
    timestamp: string;
    uptime: number;
    instance: string;
    memory: { used: number; total: number; unit: 'MB' };
    version: string;
}

export interface ReadinessResponse {
    status: 'ready' | 'degraded';
    timestamp: string;
    checks: { app: boolean; db: boolean; redis: boolean };
}

/**
 * GET /api/health — Liveness probe
 * Public endpoint (no auth required)
 * Use for: Docker, Nginx health checks, monitoring tools
 */
export const healthApi = {
    /**
     * Liveness probe — checks if the app process is alive
     */
    liveness: (): Promise<HealthResponse> => {
        return fetch('/api/health', {
            method: 'GET',
            // No auth required — public endpoint
            headers: { 'Content-Type': 'application/json' },
            // Use cache: no-store so monitoring always gets fresh data
            cache: 'no-store',
        }).then(async (res) => {
            if (!res.ok) throw new Error(`Health check failed: HTTP ${res.status}`);
            return res.json() as Promise<HealthResponse>;
        });
    },

    /**
     * Readiness probe — checks if DB + Redis are reachable
     * Public endpoint (no auth required)
     */
    readiness: (): Promise<ReadinessResponse> => {
        return fetch('/api/ready', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        }).then(async (res) => {
            if (!res.ok) throw new Error(`Readiness check failed: HTTP ${res.status}`);
            return res.json() as Promise<ReadinessResponse>;
        });
    },
};
