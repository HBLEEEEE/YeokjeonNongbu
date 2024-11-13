import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Main: React.FC = () => {
  return (
    <div>
      <Header></Header>
      <h1>메인 페이지</h1>
      <nav>
        <ul>
          <li>
            <Link to="/lottery">복권 페이지</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
          <li>
            <Link to="/ranking">랭킹 페이지</Link>
          </li>
          <li>
            <Link to="/cropmarket">작물시장 페이지</Link>
          </li>
        </ul>
      </nav>
      <Footer></Footer>
    </div>
  );
};

export default Main;
