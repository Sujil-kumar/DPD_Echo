import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout=()=> {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div className="d-flex flex-column min-vh-100 ">
      {showHeader && <Header />}
      <main className="flex-grow-1">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;