export class FrontendError extends Error {
  constructor(public status: number, public msg: string) {
    super(msg);
  }
}
