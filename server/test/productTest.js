import request from "supertest";
import express from "express";
import router from "../routes/products.js";
import { ObjectId } from "mongodb";
import test, {describe} from "node:test";

const app = express();
app.use(express.json());
app.use(router);

// Mock database connection
jest.mock("../db/connection.js", () => ({
    collection: jest.fn(() => ({
        find: jest.fn().mockReturnThis(),
        findOne: jest.fn(),
        toArray: jest.fn(),
        insertOne: jest.fn()
    }))
}));

describe("Product Routes", () => {
    test("GET / should return all products with itemLimit for red set", async () => {
        const mockProducts = [
            { _id: new ObjectId(), name: "Product A", price: 10 },
            { _id: new ObjectId("67cfc3218e6716214620f936"), name: "Red Set", price: 50 }
        ];

        require("../db/connection.js").collection().toArray.mockResolvedValue(mockProducts);
        require("../db/connection.js").collection().findOne.mockResolvedValue(null);

        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "Red Set", itemLimit: 1 })
        ]));
    });

    test("POST /calculate should return calculated total", async () => {
        const mockCart = [{ productId: "60d9f2d8e471f23f58b57a44", quantity: 2 }];
        const mockProducts = [{ _id: new ObjectId("60d9f2d8e471f23f58b57a44"), name: "Product A", price: 100 }];

        require("../db/connection.js").collection().find.mockReturnValueOnce({
            toArray: jest.fn().mockResolvedValue(mockProducts)
        });

        const response = await request(app).post("/calculate").send({ cart: mockCart });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            grandTotal: 200,
            totalDiscount: 0,
            finalTotal: 200
        });
    });

    test("POST /calculate should return error for empty cart", async () => {
        const response = await request(app).post("/calculate").send({ cart: [] });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Cart cannot be empty");
    });

    test("POST /place-order should create an order", async () => {
        require("../db/connection.js").collection().insertOne.mockResolvedValue({ insertedId: "12345" });

        const response = await request(app).post("/place-order").send({
            cart: [{ productId: "60d9f2d8e471f23f58b57a44", quantity: 1 }],
            totalAmount: 100
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("orderId", "12345");
    });

    test("POST /place-order should return error for missing totalAmount", async () => {
        const response = await request(app).post("/place-order").send({ cart: [{ productId: "60d9f2d8e471f23f58b57a44", quantity: 1 }] });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Cart cannot be empty and totalAmount is required.");
    });
});
