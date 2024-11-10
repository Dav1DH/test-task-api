import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { password, ...safeBody } = req.body;
    console.log(
      `Started ${req.method} ${req.originalUrl} - Payload: ${JSON.stringify(safeBody)}`,
    );

    res.on('finish', () => {
      const end = Date.now();
      const elapsed = end - start;
      console.log(
        `Ended ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${elapsed}ms`,
      );
    });

    next();
  }
}
