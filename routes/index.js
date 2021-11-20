const route = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  getStartedEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const users = require("./users");
const events = require("./events");
const bookmark = require("./bookmark");
const comment = require("./commentsRouter");
const rating = require("./ratingsRouter");
const authentication = require("../middlewares/validators/authentication");

// Import validator
const {
  createOrUpadateUserValidator,
} = require("../middlewares/validators/users");

const {
  createOrUpadateEventValidator,
} = require("../middlewares/validators/events");

route.get("/", getStartedEvent);
route.use("/events", events);
route.post("/signin", login);
route.post("/signup", createOrUpadateUserValidator, createUser);

route.use(authentication);

route.post("/event", createOrUpadateEventValidator, createEvent);
route.put("/event/:id", createOrUpadateEventValidator, updateEvent);
route.delete("/event/:id", deleteEvent);
route.use("/user", users);
route.use("/bookmark", bookmark);
route.use("/comment", comment);
route.use("/rating", rating);

module.exports = route;
