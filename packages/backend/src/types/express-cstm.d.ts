/// <reference types="express" />

// https://stackoverflow.com/a/58788706

declare namespace Express {
  interface Request {
    user:
      | null
      | undefined
      | {
          user: { email: string; group: string; id: number };
          permissions: string[];
          iat: number;
          exp: number;
        };
  }
}
