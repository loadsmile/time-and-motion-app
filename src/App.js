import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskInput from './components/TaskInput';
import TaskTimer from './components/TaskTimer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskInput />} />
        <Route path="/tasks" element={<TaskTimer />} />
      </Routes>
    </Router>
  );
};

export default App;
