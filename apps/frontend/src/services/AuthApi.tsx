import { AxiosError } from 'axios';
import { Login, SignUp, Introduce, Nickname } from '@/types/Index';
import { api } from './Api';
import { Platform } from '@/types/Index';

export const login = async (data: Login) => {
  try {
    const response = await api.post('auth/login', data);

    if (response.data.code === 200) {
      const { accessToken, refreshToken, nickname } = response.data.data!;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        message: response.data.message,
        nickname: nickname
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { code, message } = error.response.data;

        if (code === 400 || code === 401) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }
      }
    }

    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

export const signUp = async (data: SignUp) => {
  try {
    const response = await api.post('auth/signup', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { code, message } = error.response.data;

        if (code === 400) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }
      }
    }

    return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('auth/logout');

    if (response.data.code === 200) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return {
        success: true,
        message: response.data.message
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { code, message } = error.response.data;

        if (code === 401) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }
      }
    }

    return { success: false, message: '로그아웃 중 오류가 발생했습니다.' };
  }
};

export const oauthRedirection = async (platform: Platform) => {
  try {
    const response = await api.get(`auth/${platform}/redirect`);

    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return { success: false, message: response.data.message };
  } catch {
    return { success: false, message: '소셜 리다이렉트 처리 중 오류가 발생했습니다.' };
  }
};

export const updateNickname = async (data: Nickname) => {
  try {
    const response = await api.patch('auth/nickname', data);

    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { code, message } = error.response.data;

        if (code === 400) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }
      }
    }

    return { success: false, message: '닉네임 변경 중 오류가 발생했습니다.' };
  }
};

export const updateIntroduce = async (data: Introduce) => {
  try {
    const response = await api.patch('auth/introduce', data);

    if (response.data.code === 200) {
      return {
        success: true,
        message: response.data.message
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch {
    return { success: false, message: '소개글 변경 중 오류가 발생했습니다.' };
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};
