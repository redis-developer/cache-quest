import express from "express";
import { addLeaderboardEntry, getLeaderboard } from "./store.js";

export const router = express.Router();

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * @param {(req: Request, res: Response, next: NextFunction) => Promise<any>} fn
 * @returns
 */
function handler(fn) {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  return async (req, res, next) => {
    try {
      let nextCalled = false;
      const result = await fn(req, res, (...args) => {
        nextCalled = true;
        next(...args);
      });

      if (nextCalled) {
        return;
      } else if (result && isFinite(result.status)) {
        res.status(result.status).json(result);
      } else {
        res.json(result);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  };
}

router.post(
  "/",
  handler(async (req) => {
    const { key, score, member } = req.body;

    return addLeaderboardEntry(key, score, member);
  })
);

router.get(
  "/:key",
  handler(async (req) => {
    const { key } = req.params;
    const { count } = req.query;

    return getLeaderboard(key, count);
  })
);
