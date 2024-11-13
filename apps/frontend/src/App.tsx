import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Intro from '@/pages/Intro';
import Main from '@/pages/Main';
import Lottery from '@/pages/Lottery';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import CropMarket from '@/pages/CropMarket';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const router = createBrowserRouter([
  { path: '/', element: <Intro /> },
  { 
    path: '/main', 
    element: (
      <>
        <Header />
        <Main />
        <Footer />
      </>
    ) 
  },
  { 
    path: '/lottery', 
    element: (
      <>
        <Header />
        <Lottery />
        <Footer />
      </>
    ) 
  },
  { 
    path: '/mypage', 
    element: (
      <>
        <Header />
        <MyPage />
        <Footer />
      </>
    ) 
  },
  { 
    path: '/ranking', 
    element: (
      <>
        <Header />
        <Ranking />
        <Footer />
      </>
    ) 
  },
  { 
    path: '/cropmarket', 
    element: (
      <>
        <Header />
        <CropMarket />
        <Footer />
      </>
    ) 
  },
]);

function App() {
  return (
    <div className="bg-[#FFFBE6] min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
