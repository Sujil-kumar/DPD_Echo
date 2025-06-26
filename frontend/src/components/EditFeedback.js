import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditFeedback=()=> {
  const { feedbackId } = useParams()
  const navigate = useNavigate()
  const [data, setdata] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:5000/feedback/edit/${feedbackId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setdata(response.data)
      } 
      catch (error) 
      {
        console.error('Fetch Data Error', error);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [feedbackId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/feedback/edit/${feedbackId}`, {
        strengths: data.strengths,
        improvements: data.improvements,
        sentiment: data.sentiment
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/feedback/history/${data.employee_id}`);
    } 
    catch (error) 
    {
      console.error('Updating Feedback Error:', error);
    }
  };

  if (loading) 
    {
      return <div className="text-center my-5">Loading...</div>;
    }
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Edit Feedback for {data.employee_name}</h1>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <h5 className="text-primary">Strengths</h5>
              </label>
              <textarea
                className="form-control"
                rows="4"
                value={data.strengths}
                onChange={(e) => setdata({...data, strengths: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">
                <h5 className="text-primary">Areas to Improve</h5>
              </label>
              <textarea
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
                Update Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditFeedback;