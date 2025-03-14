interface Product {
    _id: string;
    name: string;
    imageURL: string;
    price: number;
    description: string;
    itemLimit?: number;
}

interface DiscountItem {
    _id: string;
    name: string;
    discountAmount: number;
}
interface CalculateResponse {
    grandTotal: number;
    discountItems: DiscountItem[];
    memberDiscount: number;
    finalTotal: number;
    totalDiscount: number;
}
interface CartItem {
    productId: string;
    quantity: number;
}
interface PlaceOrderResponse {
    message?: string;
    orderId?: string
}
