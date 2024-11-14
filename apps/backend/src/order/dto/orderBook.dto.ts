export interface OrderBookDto {
  orderId: number;
  cropId: number;
  orderType: 'buy' | 'sell';
  price: number;
  unfilledQuantity: number;
  timestamp: number;
}
