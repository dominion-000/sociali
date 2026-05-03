import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("Follow System Endpoints", () => {
    let user1Token, user2Id;

    beforeAll(async () => {
        // Create User 1
        const res1 = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Follower",
                last_name: "One",
                username: `follower${unique}`,
                email: `follower${unique}@test.com`,
                password: "password123"
            });
        user1Token = res1.body.data.token;

        // Create User 2
        const res2 = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Following",
                last_name: "Two",
                username: `following${unique}`,
                email: `following${unique}@test.com`,
                password: "password123"
            });
        user2Id = res2.body.data.user.id;
    });

    it("should follow another user", async () => {
        const res = await request(app)
            .post(`/api/v1/users/${user2Id}/follow`)
            .set("Authorization", `Bearer ${user1Token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Followed user");
    });

    it("should not follow same user twice", async () => {
        const res = await request(app)
            .post(`/api/v1/users/${user2Id}/follow`)
            .set("Authorization", `Bearer ${user1Token}`);
        
        expect(res.statusCode).toBe(400);
    });

    it("should list following with pagination", async () => {
        const res = await request(app)
            .get("/api/v1/users/me/following")
            .set("Authorization", `Bearer ${user1Token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination.total_items).toBe(1);
    });

    it("should unfollow user", async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${user2Id}/follow`)
            .set("Authorization", `Bearer ${user1Token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Unfollowed user");
    });
});
