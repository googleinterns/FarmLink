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
      .expect((response) => {
        expect(response.text).not.toBeNull();
      })
      .end((error, response) => {
        if (error) return done(error);
        id = JSON.parse(response.text).id;
        done();
      });
  });
});

describe("GET /produce", () => {
  it("read a list of all produce", (done) => {
    request(app)
      .get("/produce")
      .expect((response) => {
        expect(response.text).not.toBeNull();
      })
      .end((error, response) => {
        if (error) return done(error);
        done();
      });
  });
});

describe("GET /produce/:id", () => {
  it("read a specific produce", (done) => {
    request(app)
      .get(`/produce/${id}`)
      .expect((response) => {
        expect(response.text).not.toBeNull();
      })
      .end((error, response) => {
        if (error) return done(error);
        done();
      });
  });
});

describe("PUT /produce/:id", () => {
  it("update a specific produce", (done) => {
    request(app)
      .put(`/produce/${id}`)
      .send(produce)
      .expect((response) => {
        expect(response.text).not.toBeNull();
      })
      .end((error, response) => {
        if (error) return done(error);
        done();
      });
  });
});

describe("DELETE /produce/:id", () => {
  it("delete a specific produce", (done) => {
    request(app)
      .delete(`/produce/${produce.id}`)
      .expect((response) => {
        expect(response.text).not.toBeNull();
      })
      .end((error, response) => {
        if (error) return done(error);
        done();
      });
  });
});
