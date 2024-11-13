import { Alarm } from './Header';

interface AlarmModalProps {
  alarms: Alarm[];
  isOpen: boolean;
  closeModal: () => void;
  clearAllAlarms: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ alarms, isOpen, closeModal, clearAllAlarms }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-12 right-24 mt-12 mr-6 z-50">
      <div className="flex flex-col items-center bg-[#FFFEF6] border-4 border-[#FFBDBD] rounded-[16px] p-4 shadow-lg w-[270px]">
        <div className="flex justify-end w-full">
          <svg
            onClick={closeModal}
            className="cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.46967 16.4697C6.17678 16.7626 6.17678 17.2374 6.46967 17.5303C6.76256 17.8232 7.23744 17.8232 7.53033 17.5303L6.46967 16.4697ZM12.5303 12.5303C12.8232 12.2374 12.8232 11.7626 12.5303 11.4697C12.2374 11.1768 11.7626 11.1768 11.4697 11.4697L12.5303 12.5303ZM11.4697 11.4697C11.1768 11.7626 11.1768 12.2374 11.4697 12.5303C11.7626 12.8232 12.2374 12.8232 12.5303 12.5303L11.4697 11.4697ZM17.5303 7.53033C17.8232 7.23744 17.8232 6.76256 17.5303 6.46967C17.2374 6.17678 16.7626 6.17678 16.4697 6.46967L17.5303 7.53033ZM12.5303 11.4697C12.2374 11.1768 11.7626 11.1768 11.4697 11.4697C11.1768 11.7626 11.1768 12.2374 11.4697 12.5303L12.5303 11.4697ZM16.4697 17.5303C16.7626 17.8232 17.2374 17.8232 17.5303 17.5303C17.8232 17.2374 17.8232 16.7626 17.5303 16.4697L16.4697 17.5303ZM11.4697 12.5303C11.7626 12.8232 12.2374 12.8232 12.5303 12.5303C12.8232 12.2374 12.8232 11.7626 12.5303 11.4697L11.4697 12.5303ZM7.53033 6.46967C7.23744 6.17678 6.76256 6.17678 6.46967 6.46967C6.17678 6.76256 6.17678 7.23744 6.46967 7.53033L7.53033 6.46967L7.53033 17.5303L12.5303 12.5303L11.4697 11.4697L6.46967 16.4697L7.53033 17.5303ZM12.5303 12.5303L17.5303 7.53033L16.4697 6.46967L11.4697 11.4697L12.5303 12.5303ZM11.4697 12.5303L16.4697 17.5303L17.5303 16.4697L12.5303 11.4697L11.4697 12.5303ZM12.5303 11.4697L7.53033 6.46967L6.46967 7.53033L11.4697 12.5303L12.5303 11.4697Z" fill="black" />
          </svg>
        </div>
        {alarms.length > 0 && (
          <>
            <div className="max-h-[260px] overflow-y-auto mt-4">
              {alarms.slice(0, 5).map((alarm) => (
                <div key={alarm.id} className="flex items-center w-full border-b border-[#FFBDBD] py-3 px-2">
                  <img src="/coin.png" alt="coin" className="w-10 h-10 mr-4" />
                  <div className="text-[#754F44] text-center text-xs font-semibold">
                    <p>{alarm.message}</p>
                    <p>가격은 {alarm.price}입니다.</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearAllAlarms}
              className="flex justify-end w-full text-xs mt-4 text-[#FF3900] px-4 py-2"
            >
              알림 전체 삭제
            </button>
          </>
        )}
        {alarms.length === 0 && (
          <p className="text-center text-xs text-[#754F44] mt-4 mb-2">알림 내역이 존재하지 않습니다.</p>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
