// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList'; // Este lo crearemos en el siguiente paso

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </Router>
  );
}

export default App;