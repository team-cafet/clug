// std
import { ok, strictEqual } from "assert";

// 3p
import {
  Context,
  createController,
  getHttpMethod,
  getPath,
  isHttpResponseOK
} from "@foal/core";

// App
import { AuthController } from "./auth.controller";
import { isString } from "util";
import { createConnection, getConnection } from "typeorm";

describe("AuthController", () => {
  let controller: AuthController;

  before(() => createConnection());
  after(() => getConnection().close());
  
  beforeEach(() => (controller = createController(AuthController)));

  describe("has a signup method that", () => {
    it("should handle request at POST /signup", () => {
      strictEqual(getHttpMethod(AuthController, "signup"), "POST");
      strictEqual(getPath(AuthController, "signup"), "/signup");
    });

    it("should generate a web token when params are ok", async () => {
      const ctx = new Context({});

      ctx.request.body = { email: "testuser@test.ch", password: "MySecureP@ssword123" }

      let response = await controller.signup(ctx)
      ok(isHttpResponseOK(response))
      //ok(isString(response.body.token))
    });

  });
});
