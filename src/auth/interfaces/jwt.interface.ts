import { EUserRole } from '../../common/enums/user-role.enum';

export interface IJwtPayload {
  id: number;
  role: EUserRole;
}
