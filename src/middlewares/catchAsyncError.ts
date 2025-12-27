import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsyncError =
  (theFunction: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
