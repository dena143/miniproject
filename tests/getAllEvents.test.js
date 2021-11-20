const request = require("supertest");
const app = require("../app");
const { event, user, category } = require("../models");
const faker = require("faker");

beforeAll(async () => {
  let users = await user.create({
    firstName: "Dena",
    lastName: "Eka",
    email: "na@yahoo.com",
    password: "abcd",
  });

  let categories = await category.create({
    category: "Design",
  });

  for (let i = 0; i < 10; i++) {
    let events = event.create({
      title: faker.lorem.word(),
      photoEvent: faker.image.imageUrl(),
      dateEvent: "2021-11-20",
      eventTime: "19:00",
      detail: faker.lorem.paragraph(),
      linkMeet: faker.internet.url(),
      speakerName: faker.name.findName(),
      speakerJobTitle: faker.name.jobTitle(),
      userId: 1,
      categoryId: 1,
    });
  }
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
  category
    .destroy({ where: {}, force: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  event
    .destroy({ where: {}, force: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("success to get data:", () => {
  describe("Success:", () => {
    it("Should return 200 and get the data", (done) => {
      request(app)
        .get("/events")
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("totalItems");
          expect(body).toHaveProperty("events");
          expect(body).toHaveProperty("totalPages");
          expect(body).toHaveProperty("currentPage");
          expect(body).toHaveProperty("prevPage");
          expect(body).toHaveProperty("nextPage");
          expect(typeof body.totalItems).toBe("number");
          expect(typeof body.events).toBe("object");
          expect(typeof body.totalPages).toBe("number");
          expect(typeof body.currentPage).toBe("number");
          expect(typeof body.prevPage).toBe("number");
          expect(typeof body.nextPage).toBe("number");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("If there is no data of events:", () => {
    describe("Events not found", () => {
      it("Should return 404 and 'Events not found!", (done) => {
        event.destroy({ where: {}, truncate: true }).then((el) => {
          console.log(el);
        });
        request(app)
          .get("/events")
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(404);
            expect(body).toHaveProperty("errors");
            expect(body.errors).toEqual(
              expect.arrayContaining(["Events not found"])
            );
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
