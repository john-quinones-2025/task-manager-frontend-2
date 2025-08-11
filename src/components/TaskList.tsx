// src/components/TaskList.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

// Definimos la interfaz para una tarea
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        setError('Error al obtener las tareas.');
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/tasks',
        { title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Error al crear la tarea.');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:4000/api/tasks/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err) {
      setError('Error al actualizar la tarea.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mis Tareas</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleCreateTask} className="flex mb-6">
          <input
            type="text"
            className="flex-1 border p-2 rounded-l-md"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Añadir nueva tarea..."
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-md"
          >
            Añadir
          </button>
        </form>

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-gray-50 p-4 rounded-md mb-4 flex justify-between items-center ${
                task.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              <p className="font-bold">
                {task.title}
              </p>
              <div>
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  className="text-sm text-blue-500 hover:underline mr-2"
                >
                  {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay tareas para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;