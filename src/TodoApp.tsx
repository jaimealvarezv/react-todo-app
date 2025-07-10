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
    return `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      filter === filterType
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Task Master
          </h1>
          <p className="text-gray-500 text-sm">Organize your life, one task at a time</p>
        </div>

        {/* Input Section */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="What needs to be done?"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            Add
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={getFilterButtonClass("all")}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={getFilterButtonClass("pending")}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={getFilterButtonClass("completed")}
          >
            Done ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                      task.completed
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`text-lg transition-all duration-200 ${
                      task.completed 
                        ? "line-through text-gray-400" 
                        : "text-gray-700"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {filter === "all"
                ? "No tasks yet. Start by adding one above!"
                : `No ${filter} tasks found.`}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === "all" && "Your organized life starts here"}
            </p>
          </div>
        )}

        {/* Stats Footer */}
        {tasks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total: {tasks.length}</span>
              <span>Completed: {tasks.filter(t => t.completed).length}</span>
              <span>Pending: {tasks.filter(t => !t.completed).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 