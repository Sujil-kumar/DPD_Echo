import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GiveFeedback=()=> {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState([]);
  const [data, setdata] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/feedback/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployee(response.data.data);
      } 
      catch (error) 
      {
        console.error('Fetching employee Erroe:', error);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/feedback', {
        employee_id: employeeId,
        ...data
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/feedback/history/${employeeId}`);
    } 
    catch (error) 
    {
      console.error('Error submitting feedback:', error);
    }
  };

  if (loading) 
    {
      return <div className="text-center my-5">Loading...</div>;
    }
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Give Feedback</h1> 
      <div className="card">
        <div className="card-header bg-light">
          <h2 className="h4 mb-0">{employee[0].employee_name}</h2>
        </div>


        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="strengths" className="form-label">
                <h5 className="text-primary">Strengths</h5>
              </label>
              <textarea
                id="strengths"
                className="form-control"
                rows="4"
                value={data.strengths}
                onChange={(e) => setdata({...data, strengths: e.target.value})}
                required
              />
            </div>


            <div className="mb-3">
              <label htmlFor="improvements" className="form-label">
                <h5 className="text-primary">Areas to Improve</h5>
              </label>
              <textarea
                id="improvements"
                className="form-control"
                rows="4"
                value={data.improvements}
                onChange={(e) => setdata({...data, improvements: e.target.value})}
                required
              />
            </div>
        
            
            <div className="mb-4">
              <h5 className="text-primary mb-3">Sentiment</h5>
              <div className="d-flex gap-3">
                {['positive', 'neutral', 'negative'].map((sentiment) => (
                  <div key={sentiment} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sentiment"
                      id={sentiment}
                      checked={data.sentiment === sentiment}
                      onChange={() => setdata({...data, sentiment})}
                    />
                    <label className="form-check-label" htmlFor={sentiment}>
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GiveFeedback;