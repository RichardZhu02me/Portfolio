import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ChatbotWidget } from "./components/ChatbotWidget";

function App() {
  return (
    
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route index element={ <Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>

    </>
  )
}

export default App;
