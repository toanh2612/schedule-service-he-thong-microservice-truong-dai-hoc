import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import UserEvent from "../user/user.event";
import { CONSTANT } from "src/common/utils/constant";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userEvent: UserEvent) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { headers } = req;
      const authorization = headers?.["authorization"];

      if (!authorization) {
        return res.json(CONSTANT.ERROR.E0006);
      }

      const accessToken = authorization.split(" ")[1];

      const authResult: any = await this.userEvent.authUser(accessToken);

      res.locals.user = { ...authResult.decoded };
      return next();
    } catch (error) {
      return res.json({
        error,
      });
    }
  }
}
