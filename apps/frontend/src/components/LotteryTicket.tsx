import LotterySvg from './LotterySvg';
import { WIDTH, HEIGHT } from '@/constants/lotteryConstants';

interface LotteryTicketProps {
  isCanvasVisible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const LotteryTicket: React.FC<LotteryTicketProps> = ({ isCanvasVisible, canvasRef }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <LotterySvg>
        {!isCanvasVisible ? (
          <text x="540" y="380" fill="white" fontSize="130" transform="rotate(-8, 110, 230)">
            인생한방!
          </text>
        ) : (
          <text x="110" y="270" fill="white" fontSize="40" transform="rotate(-8, 110, 230)">
            인생한방!
          </text>
        )}
      </LotterySvg>

      {isCanvasVisible && (
        <div className="absolute top-[20px] left-[280px] w-[500px] h-[270px]">
          <div className="absolute flex flex-col top-0 left-0 w-full h-full flex items-center justify-center text-2xl font-bold bg-white text-black rounded-lg">
            <p>성공</p>
            <p>+ 100,000,000원!</p>
          </div>
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="absolute top-0 left-0 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default LotteryTicket;
