import React, { useState, useRef, useEffect } from 'react';
import LotteryTicket from '@/components/LotteryTicket';
import LotteryModal from '@/components/LotteryModal';
import { ERASE_RADIUS, ERASE_DISTANCE, WIDTH, HEIGHT } from '@/constants/lotteryConstants';

const Lottery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const erasedCount = useRef(0);
  let thresholdOfEraseCount = 0;

  const openModal = () => setIsModalOpen(true);

  const handleConfirm = () => {
    setIsCanvasVisible(true);
    setIsScratching(true);
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);

  const resetLottery = () => {
    setIsCanvasVisible(false);
    setIsScratching(false);
    erasedCount.current = 0;
  };

  const initCanvas = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#C9C9C9';
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const col = Math.ceil(WIDTH / (ERASE_RADIUS * 2 + ERASE_DISTANCE));
    const row = Math.ceil(HEIGHT / (ERASE_RADIUS * 2 + ERASE_DISTANCE));
    thresholdOfEraseCount = col * row * 4;

    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        context.save();
        context.beginPath();
        context.arc(
          ERASE_RADIUS + i * (ERASE_RADIUS * 2 + ERASE_DISTANCE),
          ERASE_RADIUS + j * (ERASE_RADIUS * 2 + ERASE_DISTANCE),
          ERASE_RADIUS,
          0,
          2 * Math.PI,
          false
        );
        context.fill();
        context.closePath();
        context.restore();
      }
    }

    context.fillStyle = 'black';
    context.font = 'bold 20px sans-serif';
    context.textAlign = 'center';
    context.fillText('마우스로 긁어서 결과를 확인해보세요!', WIDTH / 2, HEIGHT / 2);
  };

  const clearCanvas = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    initCanvas(context);

    const handleDrawingStart = () => {
      isDrawing.current = true;
    };

    const handleDrawing = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(offsetX, offsetY, ERASE_RADIUS, 0, 2 * Math.PI, false);
      context.fill();
      context.restore();

      erasedCount.current += 1;

      if (erasedCount.current >= thresholdOfEraseCount) {
        clearCanvas(context);
        isDrawing.current = false;
        setIsScratching(false);
      }
    };

    const handleDrawingEnd = () => {
      isDrawing.current = false;
    };

    let lastDrawTime = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastDrawTime < 10) return;
      lastDrawTime = now;

      handleDrawing(event);
    };

    canvas.addEventListener('mousedown', handleDrawingStart);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleDrawingEnd);
    canvas.addEventListener('mouseleave', handleDrawingEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleDrawingStart);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleDrawingEnd);
      canvas.removeEventListener('mouseleave', handleDrawingEnd);
    };
  }, [isCanvasVisible]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-8 font-sans select-none">
      <LotteryTicket isCanvasVisible={isCanvasVisible} canvasRef={canvasRef} />

      <div className="relative h-[50px]">
        {!isScratching && !isCanvasVisible && (
          <button
            onClick={openModal}
            className="p-2 bg-brown-dark text-light-grey rounded-lg shadow-lg min-w-[250px] min-h-[50px]"
          >
            복권긁기
          </button>
        )}

        {!isScratching && isCanvasVisible && (
          <button
            onClick={resetLottery}
            className="p-2 bg-brown-dark text-light-grey rounded-lg shadow-lg min-w-[250px] min-h-[50px]"
          >
            또 긁으러 가기
          </button>
        )}
      </div>

      {isModalOpen && <LotteryModal handleCancel={handleCancel} handleConfirm={handleConfirm} />}
    </main>
  );
};

export default Lottery;
