export interface ITokenContent {
  user: {
    id: number;
    username: string;
    group: string;
  };
  permissions: string | string[];
}
