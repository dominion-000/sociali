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

    });

    it("should create a post", async () => {

        const res = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Post",
                content: "Testing content"
            });

        expect(res.statusCode).toBe(201);

        postId = res.body.data._id;

    });

    it("should fetch public posts", async () => {

        const res =
            await request(app)
                .get("/api/v1/posts");

        expect(res.statusCode).toBe(200);

    });

});
