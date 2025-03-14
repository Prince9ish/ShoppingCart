import {BASE_URL} from "@/utils/const";

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/Product/`);
    const data: Product[] = await res.json();

    return data
}

export async function calculateCart(cart: CartItem[], memberNumber: string | undefined): Promise<CalculateResponse> {
    const payload: any = {cart};

    if (memberNumber && memberNumber.trim() != "") {
        payload.memberNumber = memberNumber;
    }

    try {
        const response = await fetch(`${BASE_URL}/Product/calculate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error submitting order:", error);
    }
};

export async function placeOrder(cart: CartItem[], memberNumber: string, finalTotal: number): Promise<PlaceOrderResponse> {
    const payload: any = {cart};

    if (memberNumber.trim() != "") {
        payload.memberNumber = memberNumber;
    }

    payload.totalAmount = finalTotal

    try {
        const response = await fetch(`${BASE_URL}/Product/place-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error submitting order:", error);
    }
};
