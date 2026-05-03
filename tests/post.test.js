import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("Post Endpoints", () => {
    let token;
    let postId;

    beforeAll(async () => {
        const user = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Post",
                last_name: "Tester",
                username: `posttester${unique}`,
                email: `post${unique}@test.com`,
                password: "123456"
            });
        token = user.body.data.token;

        // Create several posts for pagination testing
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post("/api/v1/posts")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: `Test Post ${i}`,
                    content: "Testing content",
                    tags: "test,pagination"
                });
        }
    });

    it("should create a post", async () => {
        const res = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Primary Post",
                content: "Main testing content"
            });

        expect(res.statusCode).toBe(201);
        postId = res.body.data._id;
    });

    it("should update a post", async () => {
        const res = await request(app)
            .patch(`/api/v1/posts/${postId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Title" });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe("Updated Title");
    });

    it("should publish a post", async () => {
        const res = await request(app)
            .patch(`/api/v1/posts/${postId}/publish`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.state).toBe("published");
    });

    it("should fetch public posts with pagination", async () => {
        const res = await request(app)
            .get("/api/v1/posts?limit=2");

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination).toBeDefined();
    });

    it("should search for published posts", async () => {
        const res = await request(app)
            .get("/api/v1/posts?search=Updated");
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should get own posts (me) with pagination", async () => {
        const res = await request(app)
            .get("/api/v1/posts/me")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.total_items).toBeGreaterThanOrEqual(6);
    });

    it("should delete a post", async () => {
        const res = await request(app)
            .delete(`/api/v1/posts/${postId}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post deleted");
    });
});
