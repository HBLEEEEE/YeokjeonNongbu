import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Intro from '@/pages/Intro';
import Main from '@/pages/Main';
import Lottery from '@/pages/Lottery';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import CropMarket from '@/pages/CropMarket';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

const routes = [
  { path: '/', element: <Intro /> },
  ...[
    { path: '/main', element: <Main /> },
    { path: '/lottery', element: <Lottery /> },
    { path: '/mypage', element: <MyPage /> },
    { path: '/ranking', element: <Ranking /> },
    { path: '/cropmarket', element: <CropMarket /> }
  ].map(route => ({
    ...route,
    element: <Layout>{route.element}</Layout>
  }))
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="bg-bg-color min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
