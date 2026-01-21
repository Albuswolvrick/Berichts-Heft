import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [apod, setApod] = useState(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();
        setApod(data);
      } catch (error) {
        console.error('Error fetching NASA Picture of the Day:', error);
      }
    };

    fetchApod();
  }, []);

  return (
    <div>
      {apod ? (
        <div>
          <h2>{apod.title}</h2>
          <p>{apod.date}</p>
          <img src={apod.url} alt={apod.title} style={{ maxWidth: '100%' }} />
          <p>{apod.explanation}</p>
        </div>
      ) : (
        <p>Loading NASA Picture of the Day...</p>
      )}
    </div>
  );
};

export default HomePage;
