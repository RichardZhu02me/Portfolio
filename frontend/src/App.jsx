import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const notify = () => toast("Wow so easy!");

  return (
    
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route index element={ <Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
