export interface OrderBookDto {
  orderId: string;
  cropId: string;
  orderType: 'buy' | 'sell';
  price: number;
  unfilledQuantity: number;
  timestamp: number;
}
