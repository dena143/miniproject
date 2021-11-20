const request = require("supertest");
const { user } = require("../models");
const app = require("../app");
const { encodePin } = require("../utils");

beforeAll(async () => {
  let users = await user.create({
    firstName: "Dena",
    lastName: "Eka",
    email: "de@gmail.com",
    password: "password",
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

describe("user signup", () => {
  describe("Successfully create user", () => {
    it("Should return 201 and obj (user)", (done) => {
      const hashPassword = encodePin("Rahasiaaa1@");
      let input = {
        firstName: "Dena",
        lastName: "Eka",
        email: "dena@gmail.com",
        password: hashPassword,
        confirmPassword: hashPassword,
      };
      request(app)
        .post("/signup")
        .send(input)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("data");
          expect(body.data).toMatchObject({
            id: 3,
            firstName: "Dena",
            lastName: "Eka",
            email: "dena@gmail.com",
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Email already registered", () => {
    it("Should return 400 and error messages", (done) => {
      let input = {
        firstName: "Dena",
        lastName: "Eka",
        email: "de@gmail.com",
        password: "Rahasiaaa1@",
        confirmPassword: "Rahasiaaa1@",
      };
      request(app)
        .post("/signup")
        .send(input)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message");
          expect(body.message).toBe("Email already registered!");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
