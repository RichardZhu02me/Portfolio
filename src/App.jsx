import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ChatbotWidget } from "./components/ChatbotWidget";

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
        <ChatbotWidget />
      </BrowserRouter>

    </>
  )
}

export default App;
