import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SentimentChart from './SentimentChart';

const ManagerDashboard=()=> {
  const [team, setTeam ]= useState([]);
  const [managerName,setManagerName]=useState("")
  const [totalFeedbacks,setTotalFeedbacks]=useState("")
  const [totalEmployee,setTotalEmployee]=useState("")
  const [loading,setLoading]=useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        console.log('Token being sent:', token);
        const response = await axios.get('http://localhost:5000/manager/dashboard', {
          headers: { 
            Authorization: `Bearer ${token}`,
        }
      });
        setTeam(response.data.team);
        setManagerName(response.data.managerName);
        setTotalEmployee(response.data.totalEmployees)
        setTotalFeedbacks(response.data.totalFeedbacks)
      } 
      catch (error) 
      {
      console.error('Full error:');

      if (error.response?.status === 401) 
      {
        localStorage.removeItem('token');
        navigate('/');
      } 
      else if (error.response?.status === 403) 
      {
        alert('Manager access required');
        navigate('/'); 
      }
    }
    finally 
      {
        setLoading(false);
      }
  };

  fetchDashboardData();
}, [navigate]);

  const handleGiveFeedback = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  const handleViewFeedback = (employeeId) => {
    navigate(`/feedback/history/${employeeId}`);
  };
  if(loading){
    return <div className="text-center my-5">Loading...</div>;
  }
  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4">Welcome, {managerName}</h1>
          <hr className="my-3" />
        </div>
      </div>


      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Total Team Members</h5>
              <p className="display-4">{totalEmployee}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Total Feedback Given</h5>
              <p className="display-4">{totalFeedbacks}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Sentiment Summary</h5>
              <div style={{  height: "150px" }}>
                <SentimentChart />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Team Members</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Employee Name</th>
                  <th>Feedback Count</th>
                  <th>Last Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member.employee_id}>
                    <td>
                      <strong>{member.name}</strong>
                      <br />
                      <small className="text-muted">{member.email}</small>
                    </td>
                    <td>{member.feedback_count}</td>
                    <td>{member.last_feedback_date || 'None'}</td>
                    <td>
                      {member.feedback_count > 0 && (
                        <button 
                          onClick={() => handleViewFeedback(member.employee_id)}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => handleGiveFeedback(member.employee_id)}
                        className="btn btn-sm btn-success"
                      >
                        Give Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;