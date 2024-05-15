const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const mongoose = require("mongoose");

jest.mock("jsonwebtoken");
jest.mock("passport");
jest.mock("mongoose");

const userModel = mongoose.model("User");

const getIdFromToken = require("../utils/getIdFromToken");

const url = "http://localhost:5000/api/auth";

describe("getIdFromToken", () => {
  it("GetIdFromToken function", () => {
    const fakeId = "123456";
    const req = {
      cookies: {
        jwtToken: "fake.jwt.token",
      },
    };

    jwt.verify.mockReturnValue({ _id: fakeId });

    const userId = getIdFromToken(req);

    expect(userId).toEqual(fakeId);
    expect(jwt.verify).toHaveBeenCalledWith(
      req.cookies.jwtToken,
      process.env.JWT_SECRET
    );
  });
});

describe("POST /login with axios", () => {
  it("Login Invalid credentials", async () => {
    passport.authenticate.mockImplementation(
      (strategy, callback) => (req, res, next) =>
        callback(null, false, { message: "Invalid credentials" })
    );

    try {
      const response = await axios.post(`${url}/login`, {
        email: "wrong@example.com",
        password: "wrongpass",
      });

      expect(response.status).toBe(403);
      expect(response.data).toEqual({ message: "invalid email or password" });
    } catch (error) {
      console.log(error);
    }
  });

  it("Login Valid Credentials", async () => {
    try {
      const response = await axios.post(`${url}/login`, {
        email: "test@estiam.com",
        password: "password",
      });

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ email: "test@estiam.com" });
      expect(response.headers["set-cookie"][0]).toContain(
        "jwtToken=fake.jwt.token"
      );
    } catch (error) {
      console.log(error);
    }
  });
});

describe("POST /register with axios", () => {
  it("Register Existing User", async () => {
    const existingUser = {
      email: "existing@example.com",
      password: "existingpass",
    };

    try {
      const response = await axios.post(`${url}/register`, existingUser);
      expect(response.status).toBe(409);
      expect(response.data).toEqual({ message: "this user already exist" });
    } catch (error) {
      console.log(error);
    }
  });
  it("Register New User", async () => {
    const newUser = {
      email: "new@example.com",
      password: "newpass",
    };

    try {
      const response = await axios.post(`${url}/register`, newUser);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ email: newUser.email });
      expect(userModel.create).toHaveBeenCalledWith({
        email: newUser.email,
        password: "hashedPassword",
      });
      expect(authentification).toHaveBeenCalledWith(req, res, next);
    } catch (error) {
      console.log(error);
    }
  });
});

describe("GET /islogged with axios", () => {
  it("Check if user is logged in", async () => {
    passport.authenticate.mockImplementation(
      (strategy, callback) => (req, res, next) =>
        callback(null, { _id: "123456" }, null)
    );
    try {
      const response = await axios.get(`${url}/islogged`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ isLogged: true });
    } catch (error) {
      console.log(error);
    }
  });
  it("Check if user is not logged in", async () => {
    passport.authenticate.mockImplementation(
      (strategy, callback) => (req, res, next) =>
        callback(null, false, { message: "Unauthorized" })
    );
    try {
      const response = await axios.get(`${url}/islogged`);
      expect(response.status).toBe(401);
      expect(response.data).toEqual({ isLogged: false });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("POST /logout with axios", () => {
  it("Logout user", async () => {
    try {
      const response = await axios.post(`${url}/logout`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ isLogged: false });
      expect(response.headers["set-cookie"][0]).toContain("jwtToken=");
    } catch (error) {
      console.log(error);
    }
  });
});
