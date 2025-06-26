import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header=()=> {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-black text-white p-1 sticky-top">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <h1 className="m-0 fs-4">DPD Echo</h1>
          <p className="m-0 small opacity-75">Seamless feedback. Zero friction.</p>
        </div>
        <button 
              onClick={handleLogout}
              className="btn btn-outline-light"
            >
              Logout
            </button>
      </div>
    </header>
   
  );
}

export default Header;