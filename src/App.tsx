import { useState } from "react";
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "nes.css/css/nes.min.css";




function App() {
  return(
    <>
      <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/blog/:handle" element={<BlogPage />} />
            <Route path="/blog/post/:handle/:uri" element={<PostPage />} />
            <Route path="/profile/:handle" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
      </BrowserRouter>
      </div>
      <div className="grid-bg"></div>
    </>
  );
}

export default App;
