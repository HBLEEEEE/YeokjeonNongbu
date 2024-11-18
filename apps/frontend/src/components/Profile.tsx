import { useState } from 'react';
import EditIcon from '@/components/EditIcon';

interface ProfileProps {
  id: string;
  modalOpen: () => void;
}

const Profile: React.FC<ProfileProps> = ({ id, modalOpen }) => {
  const [introduce, setIntroduce] = useState<string>('안녕하세요! 농부왕의 농장입니다!');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handleDoubleClick = () => {
    setIsEditable(true);
  };

  const handleBlur = () => {
    setIsEditable(false);
  };

  return (
    <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-6 w-[300px]">
      <div className="relative w-16 h-16 flex items-center justify-center mb-2">
        <img src="/trophy.png" className="absolute w-full h-full object-contain" alt="Trophy" />
        <p className="absolute text-red-soft text-2xl font-bold">10000</p>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <p className="text-lg font-bold">{id}</p>
        <EditIcon onClick={modalOpen}></EditIcon>
      </div>
      <div className="flex w-full bg-light-red mt-2 flex-grow rounded-md text-center justify-center p-2">
        <textarea
          className={`bg-light-red text-red-soft font-bold px-2 py-1 w-full cursor-pointer resize-none rounded
          ${isEditable ? 'focus:outline' : 'focus:outline-none'}`}
          value={introduce}
          onChange={e => setIntroduce(e.target.value)}
          readOnly={!isEditable}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default Profile;
