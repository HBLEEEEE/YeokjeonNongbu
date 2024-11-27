export interface LimitOrder {
    cropId: number;
    orderType: string;
    tradingType: string;
    quantity: number;
    price: number;
}

export interface MarketOrder {
    cropId: number;
    orderType: string;
    tradingType: string;
    totalAmount: number;
    quantity: number;
}

export interface HistoryData {
    orderId: number;
    cropId: number;
    orderType: string;
    price: number;
    totalPrice: number;
    createdAt: string;
    amount: number;
}