import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from local storage on initial render
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo, dueDate, priority, completed: false },
      ]);
      setNewTodo('');
      setDueDate('');
      setPriority('');
    }
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing a todo
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited todo
  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter todos based on search query
  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg">
        To-Do App
      </h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="border p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />

      {/* Add Task Section */}
      <div className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <AnimatePresence>
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No tasks to display.
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center p-4 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="mr-2"
                />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 mr-2"
                  />
                ) : (
                  <span
                    className={`text-gray-800 dark:text-white ${
                      todo.completed ? 'line-through' : ''
                    }`}
                  >
                    {todo.text} (Due: {todo.dueDate}, Priority: {todo.priority})
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingId === todo.id ? (
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(todo.id, todo.text)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400">
        Built with ❤️ by Reza SRK
      </footer>
    </div>
  );
};

export default App;