import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewFeedback=()=> {
  const { employeeId } = useParams()
  const [employee, setEmployee] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/feedback/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployee(response.data.data);
        setTotal(response.data.total_feedback);
      } 
      catch (error) 
      {
        console.error('Error fetching feedback:', error);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [employeeId]);

  const getSentimentBadge = (sentiment) => {
    const colorMap = {
      positive: 'success',
      neutral: 'warning',
      negative: 'danger'
    };
    return <span className={`badge bg-${colorMap[sentiment]}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>;
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">View Feedback</h1>
      
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h2 className="h5 mb-0">{employee.name}</h2>
          <span className="text-muted">Feedback History ({total})</span>
        </div>
        
        <div className="card-body">
          {total === 0 ? (<p>No feedback available for this employee.</p>) : 
          (
            employee.map((feedback, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between mb-2">
                  <h5 className="mb-0">
                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </h5>
                  <div>
                    {getSentimentBadge(feedback.sentiment)}
                  </div>
                </div>
                
                <div className="row mb-2">
                  <div className="col-md-6">
                    <h6 className="text-primary">Strengths:</h6>
                    <p>{feedback.strengths}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary">Areas to Improve:</h6>
                    <p>{feedback.improvements}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/feedback/edit/${feedback.id}`)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Edit Feedback
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/manager/dashboard')}
        className="btn btn-outline-primary"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default ViewFeedback;