import { CropData } from '@/types/Crop';
import { useUser } from '../public/UserContext';
import { useState } from 'react';

interface TradeProps {
  trade: string;
  order: string;
  currentCrop: number;
  crops: CropData[];
  setOrderType: (order: string) => void;
}

const Trade: React.FC<TradeProps> = ({ trade, order, currentCrop, crops, setOrderType }) => {
  const [price, setPrice] = useState<number>(1000);
  const [quantity, setQuantity] = useState<number>(0);
  const { availableCash } = useUser();

  const handleIncrease = () => {
    setPrice(prevPrice => prevPrice + 1000);
  };

  const handleDecrease = () => {
    setPrice(prevPrice => (prevPrice - 1000 >= 0 ? prevPrice - 1000 : 0));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseInt(e.target.value));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleMaxQuantity = () => {
    if (price > 0) {
      setQuantity(Math.floor(availableCash / price));
    }
  };

  const handleOrder = async () => {
    const crop = crops.find(crop => crop.cropId === currentCrop);
    const cropId = crop?.cropId;
    console.log(cropId);

    const tradingType = trade === '매수' ? 'buy' : 'sell';
    console.log(tradingType);

    const orderType = order === '지정가' ? 'limit' : 'market';
    console.log(orderType);

    console.log(quantity);

    console.log(price);
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-sm">주문 유형</span>
        <div className="flex gap-1">
          {['지정가', '시장가'].map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-2 py-1 rounded-md text-xs ${
                order === type ? 'bg-light-pink' : 'bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {order === '지정가' && (
        <>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">{trade} 가격</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={price}
                onChange={handleInputChange}
                className="w-24 text-center border rounded-md text-sm px-2 py-1"
              />
              <button
                className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs"
                onClick={handleDecrease}
              >
                -
              </button>
              <button
                className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">주문 수량</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="0"
                className="w-14 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button
                className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs"
                onClick={handleMaxQuantity}
              >
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{availableCash.toLocaleString()} 원</span>
          </div>
          <button
            className={`w-full py-2 mt-10 text-white rounded-md font-semibold text-sm ${
              trade === '매수' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            onClick={handleOrder}
          >
            {trade}
          </button>
        </>
      )}

      {order === '시장가' && (
        <>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">주문 수량</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="0"
                className="w-14 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs">
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{availableCash.toLocaleString()} 원</span>
          </div>
          <button
            className={`w-full py-2 mt-12 text-white rounded-md font-semibold text-sm ${
              trade === '매수' ? 'bg-red-500' : 'bg-blue-600'
            }`}
            onClick={handleOrder}
          >
            {trade}
          </button>
        </>
      )}
    </>
  );
};

export default Trade;
