// import { oauthRedirection } from '@/services/AuthApi';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Platform } from '@/types/Index';

interface OauthLoginProps {
  platform: Platform;
}

const OauthLogin: React.FC<OauthLoginProps> = ({ platform }) => {
  //   const navigate = useNavigate();

  // useEffect(() => {
  //     const handleRedirect = async () => {
  //         try {
  //             const response = await oauthRedirection(platform);

  //             if (response.success) {
  //                 alert(response.message);
  //                 navigate('/main');
  //             } else {
  //                 alert(response.message || '로그인 중 오류가 발생했습니다.');
  //                 navigate('/');
  //             }
  //         } catch (error) {
  //             if (error instanceof Error) {
  //                 alert(error.message || '서버와의 연결에 실패했습니다.');
  //             } else {
  //                 alert('서버와의 연결에 실패했습니다.');
  //                 navigate('/');
  //             }
  //         }
  //     };

  //     handleRedirect();
  // }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{platform} 로그인 처리 중...</h1>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default OauthLogin;
