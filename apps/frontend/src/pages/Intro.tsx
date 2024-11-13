import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroTitle from '@/components/IntroTitle';
import CloseIcon from '@/components/CloseIcon';
import BackIcon from '@/components/BackIcon';

enum ModalStep {
  None = 0,
  Login = 1,
  SignUpStep1 = 2,
  SignUpStep2 = 3,
}

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [skipAnimations, setSkipAnimations] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<ModalStep>(ModalStep.None);

  const handleLogin = () => navigate('/main');

  const handleSkipAnimations = () => {
    setSkipAnimations(true);
    setIsButtonVisible(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsButtonVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setModalStep(ModalStep.None);

  const ModalButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button className="mt-2 p-2 bg-brown-dark text-light-grey rounded" onClick={onClick}>
      {children}
    </button>
  );

  const ModalContent = () => {
    switch (modalStep) {
      case ModalStep.Login:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">로그인</h2>
            <ModalButton onClick={handleLogin}>로그인</ModalButton>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
              <path d="M0 16c0 8.837 7.163 16 16 16s16-7.163 16-16-7.163-16-16-16-16 7.163-16 16zm23.604 4.738l-2.63-.17-1.4 1.048c-.6.457-.903.63-1.375.553-.472-.076-.84-.482-.98-.973-.183-.374-.25-.8-.223-1.208.051-.729.294-1.315.727-1.713l-.133-.933c-.525.443-1.124.68-1.773.68-1.148 0-2.074-.874-2.074-1.948s.926-1.948 2.074-1.948c.516 0 .982.192 1.379.536l.964-.775c.122-.097.2-.245.222-.4-.07-.337-.272-.655-.586-.836-.739-.58-1.607-.93-2.537-.93-1.527 0-2.77.815-3.389 2.053-.551-.276-1.184-.47-1.838-.47-2.417 0-4.39 1.866-4.39 4.168s1.973 4.168 4.39 4.168c1.231 0 2.364-.486 3.17-1.305 0 0 1.654 1.56 1.804 1.743-.046-.116-.084-.23-.123-.35-.233-.647-.377-1.296-.433-1.961.017.01.034.02.051.03.265-.14.565-.24.863-.276 1.014.129 1.974.865 2.224 1.89z" />
            </svg>
            <p
              className='
                cursor-pointer
                hover:underline
                text-xs
                text-black
              '
              onClick={() => setModalStep(ModalStep.SignUpStep1)}
            >
              Don't have account?
            </p>
          </>
        );
      case ModalStep.SignUpStep1:
        return (
          <>
            <BackIcon onClick={() => setModalStep(ModalStep.Login)}></BackIcon>
            <h2 className="text-xl font-bold mb-4">회원가입</h2>
            <ModalButton onClick={() => setModalStep(ModalStep.SignUpStep2)}>다음</ModalButton>
          </>
        );
      case ModalStep.SignUpStep2:
        return (
          <>
            <BackIcon onClick={() => setModalStep(ModalStep.SignUpStep1)}></BackIcon>
            <h2 className="text-xl font-bold mb-4">회원가입 - 2단계</h2>
            <ModalButton onClick={closeModal}>회원가입</ModalButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-screen" onClick={handleSkipAnimations}>
      <IntroTitle skipAnimations={skipAnimations} />
      <div
        className="bg-intro h-screen w-screen bg-no-repeat bg-center"
        style={{ backgroundSize: '100% 100%' }}
      ></div>

      <button
        className={`
          bg-start cursor-pointer absolute bg-no-repeat bg-contain border-none
          left-[50%] top-[70%] translate-x-[-50%] translate-y-[-50%]
          w-[160px] h-[120px] md:w-[230px] md:h-[150px] lg:w-[240px] lg:h-[160px] xl:w-[250px] xl:h-[170px]
          ${isButtonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000
        `}
        onClick={() => setModalStep(ModalStep.Login)}
        aria-label="Start"
      ></button>

      {modalStep !== ModalStep.None && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-bg-color opacity-90 p-8 rounded-lg shadow-lg">
            <ModalContent />
            <CloseIcon onClick={closeModal}></CloseIcon>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intro;
