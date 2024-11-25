import { useState, useRef, useEffect } from 'react';
import EditIcon from '@/components/EditIcon';
import SaveIcon from './SaveIcon';
import { updateIntroduce } from '@/services/AuthApi';
import { getMyRank } from '@/services/RankApi';

interface ProfileProps {
  id: string;
  modalOpen: () => void;
}

const Profile: React.FC<ProfileProps> = ({ id, modalOpen }) => {
  const [tmpIntro, setTmpIntro] = useState<string>('안녕하세요! 농부왕의 농장입니다!');
  const [introduce, setIntroduce] = useState<string>('안녕하세요! 농부왕의 농장입니다!');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [myRank, setMyRank] = useState<number>(0);
  const [error, setError] = useState<string | null>('데이터 로딩 중 오류가 발생했습니다.');

  useEffect(() => {
    const fetchMyRank = async () => {
      try {
        const response = await getMyRank();
        if (response.success) {
          setMyRank(response.rank || 0);
          setError(null);
        } else {
          setError(response.message || '데이터 로딩 중 오류가 발생했습니다.');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || '서버와의 연결에 실패했습니다.');
        } else {
          setError('서버와의 연결에 실패했습니다.');
        }
      }
    };

    fetchMyRank();
  }, []);

  const editIntroduce = () => {
    if (!isEditable) {
      setIsEditable(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } else {
      if (tmpIntro != introduce) {
        changeIntroduce(tmpIntro);
      }
      setIsEditable(false);
    }
  };

  const changeIntroduce = async (newIntroduce: string) => {
    try {
      const response = await updateIntroduce({ introduce: newIntroduce });
      if (response.success) {
        setIntroduce(newIntroduce);
      }
    } catch {
      alert('소개글 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-6 w-[300px]">
      <div className="relative w-full h-16 flex items-center justify-center mb-2">
        {error ? (
          <p className="absolute text-red-soft font-bold">{error}</p>
        ) : (
          <>
            <img src="/trophy.png" className="absolute w-full h-full object-contain" alt="Trophy" />
            <p className="absolute top-2 text-red-soft text-2xl font-bold">
              {myRank === -1 ? 'UnRank' : myRank}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <p className="text-lg font-bold">{id}</p>
        <EditIcon onClick={modalOpen}></EditIcon>
      </div>
      <div className="flex w-full bg-light-red mt-2 flex-grow rounded-md text-center justify-center p-2">
        <textarea
          ref={textareaRef}
          className={`bg-light-red text-red-soft font-bold p-1 mt-2 mx-2 w-full resize-none rounded ${isEditable ? 'border-2 border-blue-500' : 'border-none'}`}
          value={tmpIntro}
          onChange={e => setTmpIntro(e.target.value)}
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
