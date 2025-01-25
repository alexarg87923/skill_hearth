"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findUserByEmail(user.email);
            if (existingUser)
                throw new Error("Email already in use");
            return this.userRepository.createUser(user);
        });
    }
    listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getAllUsers();
        });
    }
}
exports.UserService = UserService;
