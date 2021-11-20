const { generateToken, decodeToken } = require("../utils/jwt");

test("Generate token for user id = 2,", () => {
  expect(typeof generateToken({ id: 2 })).toBe("string");
});

test("Decode token for user id = 2,", () => {
  let token = generateToken({ id: 2 });
  expect(typeof decodeToken(token)).toBe("object");
  expect(decodeToken(token)).toMatchObject({ id: 2 });
});
