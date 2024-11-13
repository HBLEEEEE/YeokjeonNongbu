import { Link } from 'react-router-dom';

const Main: React.FC = () => {
  const amount: number = 100000000;

  const getStepImage = () => {
    if (amount < 1000000) {
      return '/step1.png';
    } else if (amount < 10000000) {
      return '/step2.png';
    } else if (amount < 50000000) {
      return '/step3.png';
    } else {
      return '/step4.png';
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div
        className="flex justify-center items-center bg-no-repeat bg-contain bg-center w-[370px] h-[360px]"
        style={{ backgroundImage: `url(${getStepImage()})` }}
      ></div>
      <nav className="flex justify-center mt-8">
        <ul className="flex list-none gap-24">
          <li>
            <Link to="/cropmarket" className="flex flex-col items-center">
              <div className="bg-cropmarket bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">작물시장</p>
            </Link>
          </li>
          <li>
            <Link to="/mypage" className="flex flex-col items-center">
              <div className="bg-mypage bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">마이페이지</p>
            </Link>
          </li>
          <li>
            <Link to="/ranking" className="flex flex-col items-center">
              <div className="bg-ranking bg-no-repeat bg-contain w-[80px] h-[100px]" />
              <p className="text-base font-bold text-light-grey text-shadow">랭킹</p>
            </Link>
          </li>
          <li>
            <Link to="/lottery" className="flex flex-col items-center">
              <div className="bg-lottery bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">복권</p>
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

export default Main;
