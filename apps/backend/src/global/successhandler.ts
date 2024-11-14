interface SuccessMessage {
  code: number;
  message: string;
}

export const successMessage = {
  SIGNUP_SUCCESS: { code: 201, message: '회원 가입되었습니다.' },
  LOGIN_SUCCESS: { code: 200, message: '로그인 되었습니다.' }
};

export function successhandler<T>(success: SuccessMessage, data: T | null = null) {
  return {
    code: success.code,
    message: success.message,
    ...(data && { data })
  };
}
