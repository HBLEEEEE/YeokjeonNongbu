import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from '@/pages/Intro';
import Main from '@/pages/Main';
import Lottery from '@/pages/Lottery';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import CropMarket from '@/pages/CropMarket';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutProps {
  path: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ path, children }) => {
  return (
    <>
      <Header />
      <motion.div
        key={path}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
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
    element: <Layout path={route.path}>{route.element}</Layout>
  }))
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="bg-bg-color min-h-screen">
      <AnimatePresence>
        <RouterProvider router={router} />
      </AnimatePresence>
    </div>
  );
}

export default App;
