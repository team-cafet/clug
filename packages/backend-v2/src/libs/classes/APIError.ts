export class APIError extends Error {
  constructor(public status: number, public msg: string) {
    super(msg);
  }
}
