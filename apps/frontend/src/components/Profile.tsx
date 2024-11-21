import { useState, useRef } from 'react';
import EditIcon from '@/components/EditIcon';
import SaveIcon from './SaveIcon';

interface ProfileProps {
  id: string;
  modalOpen: () => void;
}

const Profile: React.FC<ProfileProps> = ({ id, modalOpen }) => {
  const [introduce, setIntroduce] = useState<string>('안녕하세요! 농부왕의 농장입니다!');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editIntroduce = () => {
    if (!isEditable) {
      setIsEditable(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } else {
      setIsEditable(false);
    }
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
          ref={textareaRef}
          className={`bg-light-red text-red-soft font-bold p-1 mt-2 mx-2 w-full resize-none rounded ${isEditable ? 'border-2 border-blue-500' : 'border-none'}`}
          value={introduce}
          onChange={e => setIntroduce(e.target.value)}
          readOnly={!isEditable}
        />
        {isEditable ? (
          <>
            <SaveIcon onClick={editIntroduce} />
          </>
        ) : (
          <>
            <EditIcon onClick={editIntroduce} />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
