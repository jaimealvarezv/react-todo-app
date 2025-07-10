import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "completed" | "pending";

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      text: input.trim(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "completed":
        return task.completed;
      case "pending":
        return !task.completed;
      default:
        return true;
    }
  });

  const getFilterButtonClass = (filterType: FilterType) => {
    return `px-3 py-1 rounded-lg text-sm font-medium transition ${
      filter === filterType
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={getFilterButtonClass("all")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={getFilterButtonClass("pending")}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={getFilterButtonClass("completed")}
          >
            Completed
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span
                onClick={() => toggleTask(task.id)}
                className={`cursor-pointer select-none ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm text-red-500 hover:text-red-700 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {filter === "all"
              ? "No tasks yet. Add one above!"
              : `No ${filter} tasks.`}
          </p>
        )}
      </div>
    </div>
  );
} 