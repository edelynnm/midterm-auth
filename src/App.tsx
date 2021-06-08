import React from 'react';
import './App.css';
import { AuthContext, useProvideAuth } from './client/actions/authContext';
import AppRouter from './client/routers/router';

function App() {
  const value = useProvideAuth()
  return (
    <div>
      <AuthContext.Provider value={value}>
        <AppRouter />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
