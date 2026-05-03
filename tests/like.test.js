import request from "supertest";
import app from "./setup.js";
const unique = Date.now();

describe("Like System", () => {

    let token;
    let postId;

    beforeAll(async () => {

        const user = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                first_name: "Like",
                last_name: "Tester",
                username: `liketester${unique}`,
                email: `like${unique}@test.com`,
                password: "123456"
            });

        token = user.body.data.token;

        const post = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Like Post",
                content: "Testing like"
            });

        postId = post.body.data._id;

    });

    it("should like a post", async () => {

        const res = await request(app)
            .post(`/api/v1/posts/${postId}/like`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

    });

    it("should not like same post twice", async () => {

        const res = await request(app)
            .post(`/api/v1/posts/${postId}/like`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);

    });

});
