import { useTasks } from "@/hooks/useTasks";
import { TaskGrid } from "@/components/TaskGrid";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export function TaskList() {
  const { tasks, addTask, deleteTask, editTask, fetchTasks } = useTasks();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchTasks(token);
    } else {
      console.error("No authentication token found");
    }
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Task List</h1>
          </div>
          <TaskGrid
            tasks={tasks}
            onDelete={deleteTask}
            onEdit={editTask}
            onAdd={addTask}
          />
        </div>
      </div>
    </div>
  );
}