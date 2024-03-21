// App.js
import React from 'react';
import './App.css';
import VideoPlayer from './videoPlayer';

function App() {
  return (
    <div className="App">
      <h1 className="text-center" style={{fontSize: "20px"}}>Video Application</h1>
      <hr></hr>
      <VideoPlayer />
    </div>
  );
}

export default App;
