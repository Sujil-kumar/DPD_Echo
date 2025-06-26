import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const SentimentChartSimple=()=> {
  const [stats, setStats] = useState({});
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/feedback/sentiment-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);

        const ctx = document.getElementById('sentimentChart').getContext('2d');
        new window.Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
              label: 'Sentiment',
              data: [
                response.data.counts.positive,
                response.data.counts.neutral,
                response.data.counts.negative
              ],
              backgroundColor: ['#28a745', '#ffc107', '#dc3545']
            }]
          }
        });
      } catch (error) {
        console.error('Error fetching sentiment stats:', error);
      }
    };

  fetchStats();
}, []);

  
  return (
    
        <canvas id="sentimentChart" width="100" height="100"></canvas>
     
  );
}

export default SentimentChartSimple;
