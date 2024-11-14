export class OrderDto {
  orderId: number;
  cropId: number;
  memberId: number;
  orderType: 'buy' | 'sell';
  time: Date;
  quantity: number;
  price: number;
  status: 'pending' | 'partially_filled' | 'completed' | 'canceled';
  filledQuantity: number;
  tradingType: 'limit' | 'market';
  unfilledQuantity: number;
}
