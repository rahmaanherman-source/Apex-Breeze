import { Request, Response, NextFunction } from 'express';

/**
 * Zero-trust routing middleware.
 *
 * Enforces that every inbound connection originates from the local machine
 * (127.0.0.1 / ::1 / ::ffff:127.0.0.1).  Any request arriving from a
 * non-loopback address is rejected with HTTP 403 before it reaches any
 * handler.  This forms the security boundary that prevents off-machine
 * access to the bridge, fulfilling the zero-trust local-network requirement.
 */
export function zeroTrustGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const remoteAddress = req.socket.remoteAddress ?? '';
  const isLoopback =
    remoteAddress === '127.0.0.1' ||
    remoteAddress === '::1' ||
    remoteAddress === '::ffff:127.0.0.1';

  if (!isLoopback) {
    res.status(403).json({
      error: 'Forbidden',
      detail: 'Zero-trust policy: only loopback connections are permitted.',
    });
    return;
  }

  next();
}

/**
 * Request-origin logger for zero-trust auditing.
 * Logs every accepted connection with its remote address and route.
 */
export function auditLogger(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const ts = new Date().toISOString();
  console.info(`[ZeroTrust] ${ts} | ${req.method} ${req.path} | src=${req.socket.remoteAddress}`);
  next();
}
