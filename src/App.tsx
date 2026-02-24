// import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './auth/Register.tsx';
import Login from './auth/Login.tsx'
import Dashboard from './dashboard/Dashboard.tsx'

import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </QueryClientProvider>
  );
}
