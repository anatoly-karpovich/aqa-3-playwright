import { IUserInfo, ROLES } from "types/manager.types";

export const defaultManagerMockData: IUserInfo = {
  _id: "67c4c707c41258c86507d85d",
  username: "manager@mock.com",
  firstName: "MockName",
  lastName: "MockLastName",
  roles: [ROLES.USER],
  createdOn: new Date().toISOString(),
};
