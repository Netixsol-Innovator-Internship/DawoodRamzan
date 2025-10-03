const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/userRoutes");
const User = require("../models/user");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "johndoe",
      email: "johndoe@example.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe("johndoe");

    const user = await User.findOne({ email: "johndoe@example.com" });
    expect(user).not.toBeNull();
  });

  it("should not allow duplicate email registration", async () => {
    await new User({
      username: "existing",
      email: "test@example.com",
      password: "hashedpwd",
    }).save();

    const res = await request(app).post("/api/users/register").send({
      username: "newuser",
      email: "test@example.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login a user", async () => {
    await request(app).post("/api/users/register").send({
      username: "jane",
      email: "jane@example.com",
      password: "secret123",
    });

    const res = await request(app).post("/api/users/login").send({
      username: "jane",
      password: "secret123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/api/users/register").send({
      username: "mark",
      email: "mark@example.com",
      password: "secret123",
    });

    const res = await request(app).post("/api/users/login").send({
      username: "mark",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid password");
  });

  it("should fetch all users", async () => {
    await request(app).post("/api/users/register").send({
      username: "alpha",
      email: "alpha@example.com",
      password: "secret123",
    });
    await request(app).post("/api/users/register").send({
      username: "beta",
      email: "beta@example.com",
      password: "secret123",
    });

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
