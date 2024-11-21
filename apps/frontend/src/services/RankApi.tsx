import axios from 'axios';

const api = axios.create({
  baseURL: 'http://yeokjeonnongbu.shop:8080/api/rank',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
});

export const getTop5 = async () => {
  try {
    const response = await api.get('/top5');

    if (response.data.code === 200) {
      const top5 = response.data.data;
      return { success: true, message: response.data.message, top5 };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
  }
};

export const getMyRank = async () => {
  try {
    const response = await api.get('/now');

    if (response.data.code === 200) {
      const { rank } = response.data.data;
      return { success: true, message: response.data.message, rank };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
  }
};
