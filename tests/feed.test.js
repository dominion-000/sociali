import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("Personalized Feed Endpoint", () => {
    let user1Token, user2Id, postId;

    beforeAll(async () => {
        // Create User 1 (Follower)
        const res1 = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Feed",
                last_name: "Follower",
                username: `feedfollower${unique}`,
                email: `feedfollower${unique}@test.com`,
                password: "password123"
            });
        user1Token = res1.body.data.token;

        // Create User 2 (Author)
        const res2 = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Feed",
                last_name: "Author",
                username: `feedauthor${unique}`,
                email: `feedauthor${unique}@test.com`,
                password: "password123"
            });
        user2Id = res2.body.data.user.id;
        const user2Token = res2.body.data.token;

        // User 2 creates and publishes a post
        const postRes = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", `Bearer ${user2Token}`)
            .send({
                title: "Author Post",
                content: "Author content"
            });
        postId = postRes.body.data._id;

        await request(app)
            .patch(`/api/v1/posts/${postId}/publish`)
            .set("Authorization", `Bearer ${user2Token}`);

        // User 1 follows User 2
        await request(app)
            .post(`/api/v1/users/${user2Id}/follow`)
            .set("Authorization", `Bearer ${user1Token}`);
    });

    it("should see followed user's post in feed", async () => {
        const res = await request(app)
            .get("/api/v1/posts/feed")
            .set("Authorization", `Bearer ${user1Token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.some(p => p._id === postId)).toBe(true);
        expect(res.body.pagination).toBeDefined();
    });
});
