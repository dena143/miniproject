const request = require("supertest");
const app = require("../app");
const { user } = require("../models");
const { encodePin } = require("../utils");

beforeAll(async () => {
  const hashPassword = encodePin("rahasia");
  let users = await user.create({
    firstName: "Dena",
    lastName: "Eka",
    email: "dena@gmail.com",
    password: hashPassword,
  });
});
afterAll((done) => {
  user
    .destroy({ where: {}, force: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("User try to login:", () => {
  describe("Success:", () => {
    it("Should return 200 and access_token", (done) => {
      let input = {
        email: "dena@gmail.com",
        password: "rahasia",
      };
      request(app)
        .post("/signin")
        .send(input)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("token");
          expect(typeof body.token).toBe("string");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Failed:", () => {
    describe("Wrong email", () => {
      it("Should return 401 and 'Please signup first!", (done) => {
        let input = {
          email: "jajaja@outlook.co.id",
          password: "rahasia",
        };
        request(app)
          .post("/signin")
          .send(input)
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(401);
            expect(body).toHaveProperty("message");
            expect(body.message).toBe("Please signup first!");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("Wrong password", () => {
      it("Should return 400 and 'Please input password correctly!'", (done) => {
        let input = {
          email: "dena@gmail.com",
          password: "rafsdhasia",
        };
        request(app)
          .post("/signin")
          .send(input)
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(400);
            expect(body).toHaveProperty("message");
            expect(body.message).toBe("Please input password correctly!");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("Email or password is not found or empty", () => {
      it("Should return 400 and 'Please input email correctly'", (done) => {
        let input = {
          email: "",
        };
        request(app)
          .post("/signin")
          .send(input)
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(400);
            expect(body).toHaveProperty("message");
            expect(body.message).toBe("Please input email correctly!");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
