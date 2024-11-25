import { AxiosError } from 'axios';
import { api } from './Api';

export const getLottoResult = async () => {
  try {
    const response = await api.post('/lotto');

    if (response.data.code === 200) {
      const { remainCash, rank } = response.data.data;

      return { success: true, remainCash, rank };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { code, message } = error.response.data;

        if (code === 400 || code === 500) {
          return { success: false, message: message || '잘못된 요청입니다.' };
        }
      }
    }

    return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
  }
};
