import React, { useState } from 'react';
import Login from './pages/Login';
import Surveillance from './components/Surveillance';

function App() {
  const [authToken, setAuthToken] = useState(null);

  if (!authToken) {
    return <Login setAuthToken={setAuthToken} />;
  }

  return <Surveillance authToken={authToken} />;
}

export default App;