import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.listUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}