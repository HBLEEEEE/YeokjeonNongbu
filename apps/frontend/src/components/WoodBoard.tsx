import { ReactNode } from 'react';

interface WoodBoardProps {
  children: ReactNode;
}

const WoodBoard: React.FC<WoodBoardProps> = ({ children }) => {
  return (
    <>
      <div className="flex md:h-48 lg:h-56 xl:h-56 w-full lg:w-[520px] xl:w-[400px] bg-board1 bg-no-repeat bg-contain border-none rounded-lg">
        <div className="h-full w-full p-4 xl:p-8 2xl:p-10">{children}</div>
      </div>
    </>
  );
};

export default WoodBoard;
