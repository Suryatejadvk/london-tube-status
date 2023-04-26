import React, { useState, useEffect } from "react";

function App() {
  const [disruptions, setDisruptions] = useState([]);

  useEffect(() => {
    fetch("https://api.tfl.gov.uk/Line/Mode/tube/Disruption")
      .then((response) => response.json())
      .then((data) => setDisruptions(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>TfL Tube Disruptions</h1>
      {disruptions.length > 0 ? (
        <ul>
          {disruptions.map(
            (disruption, index) =>
              
              <li key={index}><h2>{disruption.closureText}:</h2>{disruption.description}</li>
          )}
        </ul>
      ) : (
        <p>No disruptions at the moment.</p>
      )}
    </div>
  );
}

export default App;