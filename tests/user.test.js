import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("User Profile Endpoints", () => {
    let token;
    let userData = {
        first_name: "Profile",
        last_name: "Tester",
        username: `profile${unique}`,
        email: `profile${unique}@test.com`,
        password: "password123"
    };

    beforeAll(async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send(userData);
        token = res.body.data.token;
    });

    it("should get own profile", async () => {
        const res = await request(app)
            .get("/api/v1/users/me")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.username).toBe(userData.username);
    });

    it("should update profile", async () => {
        const res = await request(app)
            .patch("/api/v1/users/me")
            .set("Authorization", `Bearer ${token}`)
            .send({ first_name: "Updated" });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.first_name).toBe("Updated");
    });
});
