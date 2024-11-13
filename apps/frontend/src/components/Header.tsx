import { Link } from 'react-router-dom';
import { useState } from 'react';

export interface Alarm {
  id: number;
  message: string;
  price: string;
}

const alarms: Alarm[] = [
  { id: 1, message: "당근 4개를 구매하셨습니다.", price: "10,000원" },
  { id: 2, message: "당근 2개를 구매하셨습니다.", price: "5,000원" },
  { id: 3, message: "당근 2개를 판매하셨습니다.", price: "5,000원" },
  { id: 4, message: "당근 2개를 구매하셨습니다.", price: "5,000원" },
  { id: 5, message: "당근 2개를 판매하셨습니다.", price: "5,000원" },
];

const Header: React.FC = () => {
  const [isAlarmOpen, setIsAlarmOpen] = useState<boolean>(false);
  const [isBarOpen, setIsBarOpen] = useState<boolean>(false);

  const toggleAlarmModal = () => {
    if(!isBarOpen) setIsAlarmOpen(!isAlarmOpen);
  };

  const toggleBarModal = () => {
    if(!isAlarmOpen) setIsBarOpen(!isBarOpen);
  };

  return (
    <header className="fixed top-[30px] left-0 w-full flex items-center justify-between px-16">
      <div className="flex items-center gap-4">
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

      <div className="flex items-center gap-6">
        <div
          onClick={toggleAlarmModal}
          className="bg-[url('./assets/header/alarm.png')] bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer"
        ></div>

        <div
          onClick={toggleBarModal}
          className="bg-[url('./assets/header/hamburgerBar.png')] bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer"
        ></div>
      </div>

      {isAlarmOpen && (
        <div className="fixed top-12 right-24 mt-12 mr-6 z-50">
          <div className="flex flex-col items-center bg-[#FFFEF6] border-4 border-[#FFBDBD] rounded-[24px] p-4 shadow-lg w-[260px]">
            <div className="flex justify-end w-full">
              <svg
                onClick={() => setIsAlarmOpen(false)}
                className="cursor-pointer"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.46967 16.4697C6.17678 16.7626 6.17678 17.2374 6.46967 17.5303C6.76256 17.8232 7.23744 17.8232 7.53033 17.5303L6.46967 16.4697ZM12.5303 12.5303C12.8232 12.2374 12.8232 11.7626 12.5303 11.4697C12.2374 11.1768 11.7626 11.1768 11.4697 11.4697L12.5303 12.5303ZM11.4697 11.4697C11.1768 11.7626 11.1768 12.2374 11.4697 12.5303C11.7626 12.8232 12.2374 12.8232 12.5303 12.5303L11.4697 11.4697ZM17.5303 7.53033C17.8232 7.23744 17.8232 6.76256 17.5303 6.46967C17.2374 6.17678 16.7626 6.17678 16.4697 6.46967L17.5303 7.53033ZM12.5303 11.4697C12.2374 11.1768 11.7626 11.1768 11.4697 11.4697C11.1768 11.7626 11.1768 12.2374 11.4697 12.5303L12.5303 11.4697ZM16.4697 17.5303C16.7626 17.8232 17.2374 17.8232 17.5303 17.5303C17.8232 17.2374 17.8232 16.7626 17.5303 16.4697L16.4697 17.5303ZM11.4697 12.5303C11.7626 12.8232 12.2374 12.8232 12.5303 12.5303C12.8232 12.2374 12.8232 11.7626 12.5303 11.4697L11.4697 12.5303ZM7.53033 6.46967C7.23744 6.17678 6.76256 6.17678 6.46967 6.46967C6.17678 6.76256 6.17678 7.23744 6.46967 7.53033L7.53033 6.46967ZM7.53033 17.5303L12.5303 12.5303L11.4697 11.4697L6.46967 16.4697L7.53033 17.5303ZM12.5303 12.5303L17.5303 7.53033L16.4697 6.46967L11.4697 11.4697L12.5303 12.5303ZM11.4697 12.5303L16.4697 17.5303L17.5303 16.4697L12.5303 11.4697L11.4697 12.5303ZM12.5303 11.4697L7.53033 6.46967L6.46967 7.53033L11.4697 12.5303L12.5303 11.4697Z" fill="black" />
              </svg>
            </div>
            <div className="max-h-[260px] overflow-y-auto my-2">
              {alarms.slice(0, 5).map((alarm) => (
                <div key={alarm.id} className="flex items-center w-full border-b border-[#FFBDBD] py-3">
                  <img src="/coin.png" alt="coin" className="w-10 h-10 mr-4" />
                  <div className="text-[#754F44] text-center text-xs font-semibold">
                    <p>{alarm.message}</p>
                    <p>가격은 {alarm.price}입니다.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBarOpen && (
        <div className="fixed top-12 right-4 mt-12 mr-6 z-50">
          <div className="flex flex-col items-center justify-center bg-[#FFFEF6] border-4 border-[#FFBDBD] rounded-[24px] p-4 mx-4 shadow-lg">
            <Link
              to="/MyPage"
              onClick={toggleBarModal}
              className="text-lg font-bold text-[#FEFEFE] text-shadow mb-2">
              마이페이지
            </Link>
            <Link
              to="/"
              onClick={toggleBarModal}
              className="text-lg font-bold text-[#FEFEFE] text-shadow">
              로그아웃
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
