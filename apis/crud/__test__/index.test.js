const axios = require("axios");
const mongoose = require("mongoose");

const url = "http://localhost:3001";

describe("The router", () => {
  test("GET ROUTE", async () => {
    const userId = "6644891672e2414ad005a8f8";
    try {
      const res = await axios.get(`${url}/profile/${userId}`);

      expect(res).toBeTruthy();
      expect(res?.status).toBe(200);
      expect(res?.data).toHaveProperty("userId");
    } catch (error) {
      console.log(error.data);
    }
  });

  test("POST ROUTE", async () => {
    const userId = new mongoose.Types.ObjectId();
    const data = {
      name: "TestUnit",
      firstname: "UnitTest",
      age: 30,
    };
    try {
      const res = await axios.post(`${url}/profile/${userId}`, data);
      expect(res).toBeTruthy();
      expect(res.status).toBe(201);
      expect(res.data).toMatchObject(data);
    } catch (error) {
      console.log(error.data);
    }
  });

  test("PATCH ROUTE", async () => {
    const userId = "6644891672e2414ad005a8f8";
    const data = {
      name: "UpdatedName",
      firstname: "UpdatedFirstname",
      age: 35,
    };
    try {
      const res = await axios.put(`${url}/profile/${userId}`, data);
      expect(res).toBeTruthy();
      expect(res.status).toBe(200);
      expect(res.data).toMatchObject(data);
    } catch (error) {
      console.log(error.data);
    }
  });

  test("DELETE ROUTE", async () => {
    const userId = "664484a4230ae8529ad8a2b9";
    try {
      const res = await axios.delete(`${url}/profile/${userId}`);
      expect(res).toBeTruthy();
      expect(res.status).toBe(200);
    } catch (error) {
      console.log(error.data);
    }
  });
});
