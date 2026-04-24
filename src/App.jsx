import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState("all");
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

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

  // func to add tasks
  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      text: input,
      completed: false,
      dueDate: dueDate || null
    };

    setTasks([...tasks, newTask]);
    setInput("");
    setDueDate("");
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(tasks[index].text);
  };

  // editing tasks
  const saveEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editedText } : task
  );

    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditedText("");
  };

  // key shortcut to add
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

  const renderTaskContent = (task, index) => {
    if (editingIndex === index) {
      return (
        <div>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={() => saveEdit(index)}>Save</button>
        </div>
      );
    }

    return (
      <div>
        <span
          style={{textDecoration: task.completed ? 'line-through' : 'none'}}>
          {task.text}
        </span>

        {task.dueDate && (
          <div className="due-date">
            Due: {task.dueDate}
          </div>
        )}
      </div>
    );
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

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      {/* filter tasks */}
      <div style={{ margin: "10px 0" }}>
        
        <button onClick={() => setFilter("all")}
          style={{
            backgroundColor: filter === "all" ? "#6c757d" : "#e0e0e0",
            color: filter === "all" ? "white" : "black"
          }}
          >All</button>

        <button onClick={() => setFilter("Incomplete")}
          style={{
            backgroundColor: filter === "Incomplete" ? "#ff0000" : "#e0e0e0",
            color: filter === "Incomplete" ? "white" : "black"
          }}
          >Incomplete</button>

        <button onClick={() => setFilter("completed")}
          style={{
            backgroundColor: filter === "completed" ? "#28a745" : "#e0e0e0",
            color: filter === "completed" ? "white" : "black"
          }}
          >Completed</button>
      </div>

      {/* completion counter */}
      <p style={{ fontSize: "0.9rem", color: "gray" }}>
        {activeCount} active • {completedCount} completed
      </p>

      <ul>
        {tasks
        // This is where the filtering works
          .filter((task) => {
            if (filter === "active") return !task.completed;
            if (filter === "completed") return task.completed;
            return true; // "all"
          })
          .map((task, index) => (
          <li key={index} className="task-item">
            <div className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(index)}
              />

              <div className="task-text">
                {renderTaskContent(task, index)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              {editingIndex !== index && (
                <button onClick={() => startEditing(index)}>
                  Edit
                </button>
              )}
              <button onClick={() => deleteTask(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


