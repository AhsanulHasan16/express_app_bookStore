// types.d.ts (or create a new file, e.g., expressRequest.d.ts)

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // or define a more specific type if needed
    }
  }
}
