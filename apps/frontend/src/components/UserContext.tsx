import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  nickname: string;
  totalAssets: number;
  setNickname: (nickname: string) => void;
  setTotalAssets: (totalAssets: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [nickname, setNickname] = useState<string>('');
  const [totalAssets, setTotalAssets] = useState<number>(0);

  return (
    <UserContext.Provider value={{ nickname, totalAssets, setNickname, setTotalAssets }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
