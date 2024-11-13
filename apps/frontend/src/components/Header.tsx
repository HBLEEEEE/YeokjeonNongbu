import { Link } from 'react-router-dom';
import { useState } from 'react';
import AlarmModal from './AlarmModal';
import BarModal from './BarModal';

export interface Alarm {
  id: number;
  message: string;
  price: string;
}

const Header: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: 1, message: "당근 4개를 구매하셨습니다.", price: "10,000원" },
    { id: 2, message: "당근 2개를 구매하셨습니다.", price: "5,000원" },
    { id: 3, message: "당근 2개를 판매하셨습니다.", price: "5,000원" },
    { id: 4, message: "당근 2개를 구매하셨습니다.", price: "5,000원" },
    { id: 5, message: "당근 2개를 판매하셨습니다.", price: "5,000원" },
  ]);
  const [isAlarmOpen, setIsAlarmOpen] = useState<boolean>(false);
  const [isBarOpen, setIsBarOpen] = useState<boolean>(false);

  const clearAllAlarms = () => {
    setAlarms([]);
  };

  const toggleAlarmModal = () => {
    if (!isBarOpen) setIsAlarmOpen(!isAlarmOpen);
  };

  const toggleBarModal = () => {
    if (!isAlarmOpen) setIsBarOpen(!isBarOpen);
  };

  return (
    <header className="fixed top-[30px] left-0 w-full flex items-center justify-between px-16">
      <div className="flex items-center gap-8">
        <Link to="/main">
          <div
            className="bg-[url('./assets/header/home.png')] bg-no-repeat bg-contain w-[50px] h-[50px]"
          ></div>
        </Link>

        <section className="flex items-center justify-center bg-[#FFFEF6] text-lg font-semibold border-4 border-[#FFBDBD] rounded-[20px] p-3 mx-4 min-w-[200px] max-w-[400px]">
          <p>농부왕</p>
        </section>

        <section className="flex items-center justify-center bg-[#FFFEF6] text-lg font-semibold border-4 border-[#FFBDBD] rounded-[20px] p-3 mx-4 min-w-[200px] max-w-[400px]">
          <p>￦ 932,517,456</p>
        </section>
      </div>

      <div className="flex items-center gap-8">
        <div
          onClick={toggleAlarmModal}
          className="bg-[url('./assets/header/alarm.png')] bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer"
        ></div>

        <div
          onClick={toggleBarModal}
          className="bg-[url('./assets/header/hamburgerBar.png')] bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer select-none"
        />
      </div>

      <AlarmModal
        alarms={alarms}
        isOpen={isAlarmOpen}
        closeModal={() => setIsAlarmOpen(false)}
        clearAllAlarms={clearAllAlarms}
      />
      <BarModal isOpen={isBarOpen} closeModal={() => setIsBarOpen(false)} />
    </header>
  );
};

export default Header;
