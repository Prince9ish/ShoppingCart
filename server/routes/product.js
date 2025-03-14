import db from "../db/connection.js";
import express from "express";
import {ObjectId} from "mongodb";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        // Fetch all products
        const productList = await db.collection("Product").find({}).toArray();

        // Specific Red set product ID (as string)
        const redSetId = "67cfc3218e6716214620f936";

        // Get timestamp for one hour ago
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        // Check if a red set was ordered in the last hour
        const recentRedSetOrder = await db.collection("Orders").findOne({
            "cart.productId": redSetId,
            createdAt: { $gte: oneHourAgo }
        });

        // Determine max value based on recent order existence
        const maxValue = recentRedSetOrder ? 0 : 1;

        // Append max field only for the red set product
        const updatedProductList = productList.map(product => {
            if (product._id.toString() === redSetId) {
                return { ...product, itemLimit: maxValue };
            }
            return product;
        });

        res.status(200).json(updatedProductList);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/calculate", async (req, res) => {
    try {
        const {memberNumber, cart} = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({error: "Cart cannot be empty"});
        }

        // Convert product IDs from strings to ObjectId
        const productIds = cart.map(item => {
            try {
                return new ObjectId(item.productId);
            } catch (err) {
                throw new Error(`Invalid productId: ${item.productId}`);
            }
        });

        // Fetch product details from the database using the converted ObjectIds
        const products = await db
            .collection("Product")
            .find({_id: {$in: productIds}})
            .toArray();

        // Build a lookup map for products (key as string version of _id)
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });

        // Calculate totals and pair discounts.
        let total = 0;
        let pairDiscountTotal = 0;
        const discountDetails = [];

        // Loop through each item in the cart
        for (const item of cart) {
            const product = productMap[item.productId];
            if (!product) continue; // skip if product not found

            const price = product.price;
            const quantity = item.quantity;
            const productTotal = price * quantity;
            total += productTotal;

            // For products that are Orange, Pink, or Green, calculate the pair discount.
            // (Only full pairs get a 5% discount on two items.)
            const nameLower = product.name.toLowerCase();
            if (
                nameLower.includes("orange") ||
                nameLower.includes("pink") ||
                nameLower.includes("green")
            ) {
                const pairs = Math.floor(quantity / 2);
                if (pairs > 0) {
                    const discountAmount = (price * 2) * 0.05 * pairs;
                    pairDiscountTotal += discountAmount;
                    discountDetails.push({
                        id: product._id,
                        name: product.name,
                        discountAmount: discountAmount
                    });
                }
            }
        }

        // Apply member discount if a member number is provided.
        // Member discount is 10% of the net total after pair discounts.
        let memberDiscount = 0;

        // TBD: API To Check Member Card Valid
        if (memberNumber) {
            memberDiscount = (total - pairDiscountTotal) * 0.10;
        }

        const totalDiscount = pairDiscountTotal + memberDiscount

        const finalTotal = total - totalDiscount;

        // Return the calculated result
        res.status(200).json({
            grandTotal: total, // Grand total before any discounts
            discountItems: discountDetails, // Array of discounts per product
            memberDiscount,
            totalDiscount,
            finalTotal
        });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({error: error.message || "Internal Server Error"});
    }
});

router.post("/place-order", async (req, res) => {
    try {
        const {memberNumber, cart, totalAmount} = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0 || !totalAmount) {
            return res.status(400).json({error: "Cart cannot be empty and totalAmount is required."});
        }

        // Create the order document
        const orderData = {
            cart,
            totalAmount,
            memberNumber: memberNumber || null,
            status: "pending", // Order status (pending, completed, etc.)
            createdAt: new Date(), // Timestamp
        };

        // Insert order into the "Orders" collection
        const orderResult = await db.collection("Orders").insertOne(orderData);

        // Send success response without modifying the cart
        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            orderId: orderResult.insertedId,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


export default router;
