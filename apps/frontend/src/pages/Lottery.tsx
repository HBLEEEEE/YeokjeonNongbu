import { useState, useEffect } from 'react';
import LotteryTicket from '@/components/Lottery/LotteryTicket';
import LotteryModal from '@/components/Lottery/LotteryModal';
import LotteryButtons from '@/components/Lottery/LotteryButtons';
import UseLotteryModal from '@/hooks/UseLotteryModal';
import UseLotteryCanvas from '@/hooks/UseLotteryCanvas';
import { getLottoResult } from '@/services/LotteryApi';
import { useUser } from '@/components/public/UserContext';
import { PRICE } from '@/constants/LotteryConstants';

const Lottery: React.FC = () => {
  const [rank, setRank] = useState<number>(0);
  const [tmpCash, setTmpCash] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const { totalAssets, setTotalAssets } = useUser();
  const { isModalOpen, openModal, handleCancel, handleConfirm } = UseLotteryModal();
  const {
    isCanvasVisible,
    isScratching,
    isClear,
    canvasRef,
    resetLottery,
    setIsCanvasVisible,
    setIsScratching
  } = UseLotteryCanvas();

  const canvasOpen = async () => {
    try {
      const response = await getLottoResult();
      if (response.success) {
        setRank(response.rank);
        setTmpCash(response.remainCash);
        setTotalAssets(totalAssets - PRICE);

        setIsCanvasVisible(true);
        setIsScratching(true);
        handleConfirm();
      } else {
        setError(response.message || '오류가 발생했습니다.');
      }
    } catch {
      setError('서버와의 연결에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (isClear) {
      setTotalAssets(tmpCash);
    }
  }, [isClear]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-8 font-sans select-none">
      {error ? (
        <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-8 w-[350px]">
          <p className="flex flex-col text-black text-lg font-bold">{error}</p>
        </div>
      ) : (
        <>
          <LotteryTicket isCanvasVisible={isCanvasVisible} canvasRef={canvasRef} rank={rank} />

          <div className="relative h-[50px]">
            <LotteryButtons
              isScratching={isScratching}
              isCanvasVisible={isCanvasVisible}
              openModal={openModal}
              resetLottery={resetLottery}
            />
          </div>

          {isModalOpen && <LotteryModal handleCancel={handleCancel} canvasOpen={canvasOpen} />}
        </>
      )}
    </main>
  );
};

export default Lottery;
