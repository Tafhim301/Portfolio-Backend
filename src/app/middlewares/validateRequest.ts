import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
    } catch (error) {
      next(error);
    }
  };
export const validateFormDataRequest =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
     req.body = schema.parse(JSON.parse(req.body.data));
     next();
   }
