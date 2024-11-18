import CloseIcon from './CloseIcon';
import { Alarm } from '@/types/Index';

interface AlarmModalProps {
  alarms: Alarm[];
  isOpen: boolean;
  closeModal: () => void;
  clearAllAlarms: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ alarms, isOpen, closeModal, clearAllAlarms }) => {
  if (!isOpen) return;

  return (
    <div className="fixed top-12 right-24 mt-12 mr-6 select-none">
      <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 shadow-lg w-[270px]">
        <div className="flex justify-end w-full">
          <CloseIcon onClick={closeModal} />
        </div>
        {alarms.length > 0 && (
          <>
            <div className="max-h-[260px] overflow-y-auto mt-4">
              {alarms.slice(0, 5).map(alarm => (
                <div
                  key={alarm.id}
                  className="flex items-center w-full border-b border-light-pink py-3 px-2"
                >
                  <img src="/coin.png" alt="coin" className="w-10 h-10 mr-4" />
                  <div className="text-brown-medium text-center text-xs font-semibold">
                    <p>{alarm.message}</p>
                    <p>가격은 {alarm.price}입니다.</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearAllAlarms}
              className="flex justify-end w-full text-xs mt-4 text-red-alert px-4 py-2"
            >
              알림 전체 삭제
            </button>
          </>
        )}
        {alarms.length === 0 && (
          <p className="text-center text-xs text-brown-medium mt-4 mb-2">
            알림 내역이 존재하지 않습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
