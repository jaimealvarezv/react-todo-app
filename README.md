# React Todo App

A modern, feature-rich todo application built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Add tasks with input field and button
- ✅ Display tasks as a list
- ✅ Toggle task completion with strikethrough
- ✅ Delete tasks from the list
- ✅ **localStorage persistence** - tasks are saved and restored automatically
- ✅ **UUID for unique IDs** - prevents ID conflicts
- ✅ **Filter functionality** - view All, Pending, or Completed tasks
- ✅ Modern UI with Tailwind CSS styling
- ✅ Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **UUID** - Unique ID generation
- **Vite** - Build tool and dev server
- **localStorage** - Data persistence

## Project Structure

```
src/
├── App.tsx          # Main app component
├── TodoApp.tsx      # Todo application logic
├── main.tsx         # Application entry point
└── index.css        # Tailwind CSS imports
```

## Key Features Explained

### localStorage Persistence
The app automatically saves tasks to localStorage whenever they change and loads them when the app starts:

```typescript
// Load tasks on mount
useEffect(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }
}, []);

// Save tasks when they change
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);
```

### UUID for Unique IDs
Instead of using `Date.now()`, the app uses UUID v4 for guaranteed unique IDs:

```typescript
import { v4 as uuidv4 } from "uuid";

const newTask: Task = {
  id: uuidv4(), // Guaranteed unique
  text: input.trim(),
  completed: false,
};
```

### Filter Functionality
Three filter options are available:
- **All**: Shows all tasks
- **Pending**: Shows only incomplete tasks
- **Completed**: Shows only completed tasks

The filtering is done with a simple switch statement:

```typescript
const filteredTasks = tasks.filter((task) => {
  switch (filter) {
    case "completed": return task.completed;
    case "pending": return !task.completed;
    default: return true;
  }
});
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build 