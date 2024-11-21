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
import PrivateRoute from '@/components/ProtectRoute';
import { UserProvider } from '@/components/UserContext';

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
    { path: '/main', element: <PrivateRoute element={<Main />} /> },
    { path: '/lottery', element: <PrivateRoute element={<Lottery />} /> },
    { path: '/mypage', element: <PrivateRoute element={<MyPage />} /> },
    { path: '/ranking', element: <PrivateRoute element={<Ranking />} /> },
    { path: '/cropmarket', element: <PrivateRoute element={<CropMarket />} /> }
  ].map(route => ({
    ...route,
    element: <Layout path={route.path}>{route.element}</Layout>
  }))
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="bg-bg-color min-h-screen">
      <UserProvider>
        <AnimatePresence>
          <RouterProvider router={router} />
        </AnimatePresence>
      </UserProvider>
    </div>
  );
}

export default App;
