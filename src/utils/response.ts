import { Response, NextFunction, Request } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

/* -------------------------------------------------------------
 *  Types
 * ----------------------------------------------------------- */
export interface ApiResponse<T = any> {
  HTTPStatus: number;         // 200, 404, 500 …
  message: string;            // human‑readable
  responseObject?: T;         // optional payload
}

/* -------------------------------------------------------------
 *  Success helper
 * ----------------------------------------------------------- */
export function sendSuccess<T>(
  res: Response,
  status: StatusCodes = StatusCodes.OK,
  payload?: T,
  msg?: string,
) {
  const body: ApiResponse<T> = {
    HTTPStatus: status,
    message: msg || getReasonPhrase(status),
    ...(payload !== undefined ? { responseObject: payload } : {}),
  };
  return res.status(status).json(body);
}

/* -------------------------------------------------------------
 *  Error helper – throws, to be caught by error middleware
 * ----------------------------------------------------------- */
export class ApiError extends Error {
  HTTPStatus: StatusCodes;
  constructor(
    status: StatusCodes,
    message = getReasonPhrase(status),
    public details?: any,
  ) {
    super(message);
    this.HTTPStatus = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/* -------------------------------------------------------------
 *  Global error‑handler (plug into app.use at bottom)
 * ----------------------------------------------------------- */
export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status: StatusCodes = err.HTTPStatus ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const body: ApiResponse = {
    HTTPStatus: status,
    message: err.message || getReasonPhrase(status),
    ...(err.details ? { responseObject: err.details } : {}),
  };
  // Optional: log stack for 5xx only
  if (status >= 500) console.error(err);
  res.status(status).json(body);
}


export function next(arg0: ApiError) {
  throw new Error("Function not implemented.");
}
