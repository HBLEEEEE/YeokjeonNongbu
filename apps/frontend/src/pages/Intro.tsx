import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroTitle from '@/components/IntroTitle';

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const handleLogin = () => {
    navigate('/main');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonVisible(true);
    }, 4000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <IntroTitle />
      <div className="bg-intro h-screen w-screen bg-no-repeat bg-center" style={{ backgroundSize: '100% 100%' }}></div>

      <button
        className={`
          bg-[url('./assets/intro/start.png')] 
          cursor-pointer 
          absolute 
          bg-no-repeat 
          bg-contain
          border-none
          left-[50%] top-[70%] translate-x-[-50%] translate-y-[-50%]
          w-[160px] h-[120px]
          md:w-[230px] md:h-[150px]
          lg:w-[240px] lg:h-[160px]
          xl:w-[250px] xl:h-[170px]
          ${isButtonVisible ? 'opacity-100' : 'opacity-0'} 
          transition-opacity duration-1000
        `}
        onClick={handleLogin}
        aria-label="Start"
      ></button>
    </div>
  );
};

export default Intro;
