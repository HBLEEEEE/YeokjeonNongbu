import { useState } from 'react';
import CropSelector from '@/components/CropMarket/CropSelector';
import AskingPrice from '@/components/CropMarket/AskingPrice';
import Chart from '@/components/CropMarket/Chart';
import TradeSection from '@/components/CropMarket/TradeSection';
import WoodBoard from '@/components/CropMarket/WoodBoard';
import OwnCrop from '@/components/CropMarket/OwnCrop';

const data1Min = [
  { x: '2024-11-20T09:00:00', y: 100 },
  { x: '2024-11-20T09:01:00', y: 102 },
  { x: '2024-11-20T09:02:00', y: 104 },
  { x: '2024-11-20T09:03:00', y: 106 },
  { x: '2024-11-20T09:04:00', y: 108 },
  { x: '2024-11-20T09:05:00', y: 110 }
];

const data1Hour = [
  { x: '2024-11-20T09:00:00', y: 100 },
  { x: '2024-11-20T10:00:00', y: 120 },
  { x: '2024-11-20T11:00:00', y: 140 }
];

const CropMarket: React.FC = () => {
  const [crop, setCrop] = useState<string>('당근');
  const [activeInterval, setActiveInterval] = useState<string>('1min');
  const [timeData, setTimeData] = useState(data1Min);

  const handleIntervalChange = (interval: string) => {
    setActiveInterval(interval);
    setTimeData(interval === '1min' ? data1Min : data1Hour);
  };

  return (
    <main className="flex flex-row justify-center items-center min-h-screen select-none pt-16 gap-4">
      <div className="flex flex-col items-start z-[10] gap-4 w-full lg:w-[60%] max-w-[1300px]">
        <div className="w-full flex flex-col justify-start gap-2">
          <CropSelector
            currentCrop={crop}
            onSelect={setCrop}
            activeInterval={activeInterval}
            handleIntervalChange={handleIntervalChange}
          />
          <hr className="w-full bg-black h-[1px]" />
        </div>
        <section className="w-full items-center bg-light-gray border-4 border-light-pink rounded-2xl p-4">
          <div className="h-56 flex justify-center items-center w-full sm:h-64 md:h-36 lg:h-64 xl:h-64 2xl:h-72">
            <Chart timeData={timeData} />
          </div>
        </section>
        <section className="w-[95%] flex flex-row justify-between items-start">
          <WoodBoard>
            <h3 className="flex justify-center lg:text-sm xl:text-base font-bold mb-2">
              오늘의 {crop} 가격
            </h3>
            <AskingPrice crop={crop} />
          </WoodBoard>
          <WoodBoard>
            <h3 className="flex justify-center lg:text-sm xl:text-base font-bold mb-2">
              보유 작물
            </h3>
            <OwnCrop />
          </WoodBoard>
        </section>
      </div>
      <div className="flex flex-col items-center z-[10]">
        <TradeSection />
      </div>
    </main>
  );
};

export default CropMarket;
