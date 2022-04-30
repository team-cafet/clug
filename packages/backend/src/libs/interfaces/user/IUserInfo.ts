export interface IUserInfo {
  id: number;
  username: string;
  organisation: {
    id: number;
  } | null;
  group: {
    id: number;
  };
}
