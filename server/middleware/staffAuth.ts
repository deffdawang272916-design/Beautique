import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include staff context
declare global {
  namespace Express {
    interface Request {
      staffUser?: {
        authenticated: boolean;
        role: string;
      };
    }
  }
}

/**
 * Validates staff authentication via Bearer token or X-Staff-Key header.
 */
export function requireStaffAuth(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.STAFF_API_KEY || 'beautique-staff-demo-2026';

  let providedToken: string | undefined;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    providedToken = authHeader.substring(7).trim();
  }

  if (!providedToken) {
    const customHeader = req.headers['x-staff-key'] as string | undefined;
    if (customHeader) {
      providedToken = customHeader.trim();
    }
  }

  if (!providedToken) {
    return res.status(401).json({
      error: 'Unauthorized. Staff authentication token is required.',
      code: 'AUTH_REQUIRED',
    });
  }

  if (providedToken !== configuredKey) {
    return res.status(403).json({
      error: 'Forbidden. Invalid staff authentication credentials.',
      code: 'AUTH_FORBIDDEN',
    });
  }

  req.staffUser = {
    authenticated: true,
    role: 'clinic_staff',
  };

  next();
}
