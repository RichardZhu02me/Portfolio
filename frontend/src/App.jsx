import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ChatbotWidget } from "./components/ChatbotWidget";
import { ExamGeneratorCaseStudy } from "./pages/ExamGeneratorCaseStudy";
import { LumenParserCaseStudy } from "./pages/LumenParserCaseStudy";

function App() {
  return (

    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/exam-generator" element={<ExamGeneratorCaseStudy />} />
          <Route path="/lumen-parser" element={<LumenParserCaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>

    </>
  )
}

export default App;
