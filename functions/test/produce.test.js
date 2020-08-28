const expect = require("expect");
const request = require("supertest");

const app = require("../index");
const test = require("firebase-functions-test")();
const { produce } = require("./data");

let id;

describe("POST /produce", () => {
  it("create a new produce", (done) => {
    request(app)
      .post("/produce")
      .send(produce)
      .expect((res) => {
        expect(res.text).not.toBeNull();
      })
      .end(function (err, res) {
        if (err) return done(err);
        id = JSON.parse(res.text).id;
        done();
      });
  });
});

describe("GET /produce", () => {
  it("read a list of all produce", (done) => {
    request(app)
      .get("/produce")
      .expect((res) => {
        expect(res.text).not.toBeNull();
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /produce/:id", () => {
  it("read a specific produce", (done) => {
    request(app)
      .get(`/produce/${id}`)
      .expect((res) => {
        expect(res.text).not.toBeNull();
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("PUT /produce/:id", () => {
  it("update a specific produce", (done) => {
    request(app)
      .put(`/produce/${id}`)
      .send(produce)
      .expect((res) => {
        expect(res.text).not.toBeNull();
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("DELETE /produce/:id", () => {
  it("delete a specific produce", (done) => {
    request(app)
      .delete(`/produce/${produce.id}`)
      .expect((res) => {
        expect(res.text).not.toBeNull();
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
