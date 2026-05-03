import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("Auth Endpoints", () => {

    let userData = {
        first_name: "Test",
        last_name: "User",
        username: `testuser${unique}`,
        email: `test${unique}@example.com`,
        password: "123456"
    };

    it("should signup a user", async () => {

        const res =
            await request(app)
                .post("/api/v1/auth/signup")
                .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body.data.token).toBeDefined();

    });

    it("should login user", async () => {

        const res =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: userData.email,
                    password: userData.password
                });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.token).toBeDefined();

    });

});
