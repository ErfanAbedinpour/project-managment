import { SetMetadata } from "@nestjs/common";
import { ROLE } from "../enums/role.enum";


export const ROLE_KEY = "role"
export const Role = (...role: ROLE[]) => SetMetadata(ROLE_KEY, role)