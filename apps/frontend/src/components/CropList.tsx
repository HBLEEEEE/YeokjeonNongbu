import { Crop } from '@/types';

interface CropListProps {
  crops: Crop[];
  emergencyFund: number;
}

const CropList: React.FC<CropListProps> = ({ crops, emergencyFund }) => {
  return (
    <div className="mt-3 text-center">
      <p className="text-xl font-bold">보유 작물</p>
      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
        {crops.map((crop, index) => (
          <div key={index} className="flex flex-row items-center gap-3">
            <p>{crop.name}</p>
            <img src={crop.image} alt={crop.name} className="w-6 h-6" />
            <p>x {crop.quantity}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row mt-3 text-center gap-1">
        <p>비상금</p>
        <img src="/money.png" alt="비상금" className="w-8 h-6" />
        <p>￦ {emergencyFund.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CropList;
