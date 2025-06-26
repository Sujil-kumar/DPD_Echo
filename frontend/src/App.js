import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/LoginPage';
import ManagerPage from './components/ManagerPage';
import GiveFeedback from './components/GiveFeedback';
import ViewFeedback from './components/ViewFeedback';
import Employee from './components/Employee';
import EditFeedback from './components/EditFeedback';
import Layout from './components/Layout';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/manager/dashboard" element={<ManagerPage />} />
          <Route path="/employee/:employeeId" element={<GiveFeedback />} />
          <Route path="/feedback/history/:employeeId" element={<ViewFeedback />} />
          <Route path="/employee/dashboard" element={<Employee />} />
          <Route path="/feedback/edit/:feedbackId" element={<EditFeedback />} />
        </Route>
      </Routes>
  );
}

export default App;