import { JwtPayload } from "jsonwebtoken";
import { User } from "./interfaces";
import { Request } from "express";

export type CustomRequest = Request & { user?: User | JwtPayload | string, recepient?: User}

export type UserHidden = User & {password: string}