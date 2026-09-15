import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ChatWorkspace } from './pages/ChatWorkspace';
import { ArtifactWorkspace } from './pages/ArtifactWorkspace';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatWorkspace />} />
          <Route path="/sessions/:sessionId" element={<ChatWorkspace />} />
          <Route path="/artifacts/:artifactId" element={<ArtifactWorkspace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
