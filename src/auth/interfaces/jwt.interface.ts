import { EUserRole } from '../enums/user-role.enum';

export interface IJwtPayload {
  id: number;
  role: EUserRole;
}
