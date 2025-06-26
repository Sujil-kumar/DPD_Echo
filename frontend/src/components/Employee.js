import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [feedbackData, setFeedbackData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/employee/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbackData(response.data);
      } catch (error) {
        console.error('Fetching feedback data Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const handleAcknowledge = async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/feedback/acknowledge/${feedbackId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackData(prev => ({
        ...prev,
        timeline: prev.timeline.map(fb => 
          fb.id === feedbackId 
            ? { ...fb, acknowledged: true } 
            : fb
        ),
        stats: {
          ...prev.stats,
          acknowledged: prev.stats.acknowledged + 1
        }
      }));
    } catch (error) {
      console.error('Acknowledgment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Welcome, {feedbackData.employeeName}</h1>
        <div className="badge bg-primary rounded-pill p-2">
          <i className="bi bi-person-circle me-2"></i>
          Employee Dashboard
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card text-center h-100 shadow-sm border-primary">
            <div className="card-body py-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <i className="bi bi-chat-square-text fs-1 text-primary me-3"></i>
                <div>
                  <h2 className="display-4 mb-0">{feedbackData.stats.feedbackReceived}</h2>
                  <p className="card-text text-muted">Feedback Received</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card text-center h-100 shadow-sm border-success">
            <div className="card-body py-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <i className="bi bi-check-circle fs-1 text-success me-3"></i>
                <div>
                  <h2 className="display-4 mb-0">{feedbackData.stats.acknowledged}</h2>
                  <p className="card-text text-muted">Acknowledged</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-white border-bottom-0">
          <h2 className="card-title mb-0 d-flex align-items-center">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Feedback Timeline
          </h2>
        </div>
        <div className="card-body pt-0">
          {feedbackData.feedbackReceived === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
              <p className="text-muted">No feedback received yet.</p>
            </div>
          ) : (
            feedbackData.timeline.map((feedback, index) => (
              <div key={index} className="mb-4 pb-3 border-bottom position-relative">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <i className={`bi bi-${feedback.sentiment === 'positive' ? 'emoji-smile' : 
                      feedback.sentiment === 'neutral' ? 'emoji-neutral' : 'emoji-frown'} 
                      fs-4 text-${feedback.sentiment === 'positive' ? 'success' : 
                      feedback.sentiment === 'neutral' ? 'warning' : 'danger'}`}></i>
                  </div>
                  <div>
                    <h4 className="mb-0">
                      {new Date(feedback.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </h4>
                    <span className={`badge bg-${feedback.sentiment === 'positive' ? 'success' : 
                      feedback.sentiment === 'neutral' ? 'warning' : 'danger'} text-uppercase`}>
                      {feedback.sentiment}
                    </span>
                  </div>
                </div>
                
                <div className="ps-5">
                  <div className="mb-3">
                    <h5 className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Strengths
                    </h5>
                    <div className="ms-4 ps-2">
                      {feedback.strengths}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                      Areas to Improve
                    </h5>
                    <div className="ms-4 ps-2">
                      {feedback.improvements}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    {!feedback.acknowledged ? (
                      <button 
                        onClick={() => handleAcknowledge(feedback.id)}
                        className="btn btn-primary btn-sm d-flex align-items-center"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-success d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;