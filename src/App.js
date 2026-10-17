import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SignUp, Login, ForgetPassword, VerifyCode, ResetPassword, Missing } from './components';
import Admin from './dashboard/Admin';
import { ContextProvider } from './hook/ContextProvider';
import { CanvasProvider } from './hook/CanvasProvider';
import PrivateRoutes from './PrivateRoutes';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {isAdminRoute ? (
        <ContextProvider>
          <CanvasProvider>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/admin/*"
                element={
                  <PrivateRoutes>
                    <Admin />
                  </PrivateRoutes>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
            </Routes>
          </CanvasProvider>
        </ContextProvider>
      ) : (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" index element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<Missing />} />
          </Routes>
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;
