import { create } from "zustand";
import { Task } from "@/types";

interface TasksState {
  tasks: Task[];
  fetchTasks: (token: string) => Promise<void>;
  addTask: (task: Omit<Task, "id">, token: string) => Promise<void>;
  editTask: (editedTask: Task, token: string) => Promise<void>;
  deleteTask: (id: any, token: any) => Promise<void>;
}

export const useTasks = create<TasksState>((set) => ({
  tasks: [],
  fetchTasks: async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ tasks: data });
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },
  addTask: async (newTask, token) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const createdTask = await response.json();
        set((state) => ({ tasks: [...state.tasks, createdTask] }));
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  },
  editTask: async (editedTask, token) => {
    try {
      const updatedTaskData = {
        status: editedTask.status,
        endTime:
          editedTask.status === "Finished"
            ? new Date().toISOString()
            : editedTask.endTime,
        priority: editedTask.priority,
      };

      const response = await fetch(
        `http://localhost:5000/api/tasks/${editedTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTaskData),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        const calculateTotalHours = (start: string, end: string) => {
          const startDate = new Date(start);
          const endDate = new Date(end);
          const diff = endDate.getTime() - startDate.getTime();
          return Number((diff / (1000 * 60 * 60)).toFixed(2));
        };

        // Recalculate totalHours after the update
        const totalHours = calculateTotalHours(
          updatedTask.startTime,
          updatedTask.endTime
        );

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === updatedTask._id ? { ...updatedTask, totalHours } : task
          ),
        }));
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },

  deleteTask: async (id: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response);
      if (response.ok) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id),
        }));
        console.log("Task deleted successfully");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));
