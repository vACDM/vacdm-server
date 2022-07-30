import { APIError } from '@shared/errors';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

function MethodNotAllowed(req: Request, res: Response, next: NextFunction) {
  next(new APIError('Method Not Allowed', null, 405));
}

router.use((req: Request, res: Response, next: NextFunction) =>
  next(new APIError('Not Found', null, 404))
);

export default router;
