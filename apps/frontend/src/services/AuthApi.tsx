import axios from 'axios';

const api = axios.create({
  baseURL: 'http://yeokjeonnongbu.shop:8080/api/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface LoginRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post('/login', data);

    if (response.data.code === 200) {
      const { accessToken, refreshToken } = response.data.data!;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        message: response.data.message
      };
    } else if (response.data.code === 400) {
      return { success: false, message: response.data.message };
    } else if (response.data.code === 401) {
      return { success: false, message: response.data.message };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

export const signUp = async (data: SignUpRequest) => {
  try {
    const response = await api.post('/signup', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
  }
};

export const logout = async () => {
  try {
    const api = axios.create({
      baseURL: 'http://yeokjeonnongbu.shop:8080/api/auth',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    const response = await api.post('/logout');

    if (response.data.code === 200) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return {
        success: true,
        message: response.data.message
      };
    } else if (response.data.code === 401) {
      return { success: false, message: response.data.message };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '로그아웃 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '로그아웃 중 오류가 발생했습니다.' };
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};
