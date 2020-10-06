import React from 'react';
import './Home.css';
import Encryption from '../components/Encryption';

export default () => {
  return (
    <div className="Home">
      <div className="lander">
        <h2>Lambda</h2>
        <p>simple lambda note taking example</p>
        <Encryption />
      </div>
    </div>
  );
}