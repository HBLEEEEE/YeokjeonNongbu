import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

// 수정 필요
// localstorage 보다 서버에 요청해서 받아오는 코드 + 페이지 넘어갈 때마다 reload 시키는 코드로 변경
// 지금은 user1으로 로그인 및 로그아웃 -> user2로 로그인시 이상하게 동작
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [nickname, setNickname] = useState<string>(() => {
    const savedNickname = localStorage.getItem('nickname');
    return savedNickname || '';
  });
  const [totalAssets, setTotalAssets] = useState<number>(() => {
    const savedTotalAssets = localStorage.getItem('totalAssets');
    return savedTotalAssets ? parseFloat(savedTotalAssets) : 0;
  });

  useEffect(() => {
    if (nickname) localStorage.setItem('nickname', nickname);
    if (totalAssets !== 0) localStorage.setItem('totalAssets', totalAssets.toString());
  }, [nickname, totalAssets]);

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
