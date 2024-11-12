import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to="/main">메인 페이지</Link>
      <Link to="/">로그아웃</Link>
    </header>
  );
};

export default Header;
