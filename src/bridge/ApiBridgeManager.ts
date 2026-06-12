import express, { Router, Request, Response } from 'express';
import { zeroTrustGuard, auditLogger } from '../routing/ZeroTrustRouter';
import {
  HandshakeController,
  BulkDataPayload,
  EcommerceEndpointConfig,
} from '../database/HandshakeController';

/** System parameter envelope exchanged between desktop and mobile clients. */
export interface SystemParameters {
  clientId: string;
  clientType: 'desktop' | 'mobile';
  sessionToken: string;
  payload: Record<string, unknown>;
}

/**
 * ApiBridgeManager
 *
 * Binds an Express application exclusively to the loopback interface
 * (127.0.0.1) so it is reachable only from the local machine.
 *
 * Responsibilities:
 *  - Apply zero-trust middleware on every route (loopback guard + audit log).
 *  - Expose a /params endpoint to receive and echo system parameters from
 *    both desktop and mobile clients.
 *  - Expose a /handshake endpoint that accepts a bulk-data payload and maps
 *    it to the configured e-commerce endpoint via HandshakeController.
 */
export class ApiBridgeManager {
  private readonly app = express();
  private readonly router: Router = Router();

  constructor(
    private readonly port: number,
    private readonly endpointConfig: EcommerceEndpointConfig
  ) {
    this.app.use(express.json({ limit: '10mb' }));
    // Zero-trust boundary: reject all non-loopback connections.
    this.app.use(zeroTrustGuard);
    this.app.use(auditLogger);
    this.mountRoutes();
    this.app.use('/api', this.router);
  }

  // ------------------------------------------------------------------
  // Route definitions
  // ------------------------------------------------------------------

  private mountRoutes(): void {
    /** Health probe — used by desktop and mobile clients to confirm the bridge is live. */
    this.router.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok', uptime: process.uptime() });
    });

    /**
     * System-parameter relay.
     * Desktop or mobile clients POST their SystemParameters here; the bridge
     * validates the envelope and echoes it back, demonstrating the routing
     * path without forwarding to any external cloud layer.
     */
    this.router.post('/params', (req: Request, res: Response) => {
      const params = req.body as Partial<SystemParameters>;

      if (
        !params.clientId ||
        !params.clientType ||
        !params.sessionToken ||
        (params.clientType !== 'desktop' && params.clientType !== 'mobile')
      ) {
        res.status(400).json({
          error: 'Invalid system parameters',
          required: ['clientId', 'clientType (desktop|mobile)', 'sessionToken'],
        });
        return;
      }

      res.json({
        received: params,
        routedAt: new Date().toISOString(),
        bridge: 'apex-bridge/local',
      });
    });

    /**
     * Bulk-data handshake.
     * Accepts a BulkDataPayload (≤ 2,000 inventory lines, ≤ 250 PDFs,
     * ≤ 250 themes) and returns the mapped e-commerce endpoint routes.
     */
    this.router.post('/handshake', (req: Request, res: Response) => {
      const payload = req.body as Partial<BulkDataPayload>;

      if (
        !Array.isArray(payload.inventoryLines) ||
        !Array.isArray(payload.assetPdfs) ||
        !Array.isArray(payload.layoutThemes)
      ) {
        res.status(400).json({
          error: 'Invalid bulk-data payload',
          required: ['inventoryLines[]', 'assetPdfs[]', 'layoutThemes[]'],
        });
        return;
      }

      try {
        const controller = new HandshakeController(this.endpointConfig);
        const routes = controller.mapToEndpoint(payload as BulkDataPayload);
        res.json({ success: true, routes });
      } catch (err) {
        res.status(422).json({ error: (err as Error).message });
      }
    });
  }

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------

  /** Start the bridge server, binding strictly to 127.0.0.1. */
  start(): void {
    this.app.listen(this.port, '127.0.0.1', () => {
      console.log(
        `[ApiBridgeManager] Listening on http://127.0.0.1:${this.port} (loopback-only)`
      );
    });
  }
}
