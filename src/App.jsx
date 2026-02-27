import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // load tasks from localStorage on first load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("Loaded from localStorage:", parsed);
        setTasks(parsed);
      } else {
        console.log("No tasks in localStorage.");
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  }, []);

  // save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = { text: input, completed: false };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleComplete = (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === indexToToggle
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="container">
      <h1>My Task Manager</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(index)}
            />
            <span style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              marginLeft: '0.5rem'
            }}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(index)} style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


