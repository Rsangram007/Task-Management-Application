import { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditTaskDialog } from "./EditTaskDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, CalendarDays, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface TaskGridProps {
  tasks: Task[];
  onDelete: (id: string, token: string) => Promise<void>;
  onEdit: (editedTask: Task, token: string) => Promise<void>;
  onAdd: (task: Omit<Task, "id">, token: string) => Promise<void>;
}

export function TaskGrid({ tasks, onDelete, onEdit, onAdd }: TaskGridProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"Pending" | "Finished" | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aTaskId = a.taskId ? Number(a.taskId) : 0;
    const bTaskId = b.taskId ? Number(b.taskId) : 0;
    return sortDirection === "asc" ? aTaskId - bTaskId : bTaskId - aTaskId;
  });

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await onDelete(id, token);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    } else {
      toast.error("Authentication required");
    }
  };

  const handleEdit = async (task: Task) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await onEdit(task, token);
        toast.success("Task updated successfully");
        setEditingTask(null);
      } catch (error) {
        toast.error("Failed to update task");
      }
    } else {
      toast.error("Authentication required");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <AddTaskDialog onAddTask={onAdd} />
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort by Task ID
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortDirection("asc")}>
                  Task ID (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortDirection("desc")}>
                  Task ID (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {[1, 2, 3, 4, 5].map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 bg-priority-${priority}`} />
                    Priority {priority}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Finished")}>
                  Finished
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTasks.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No tasks match your filters
          </div>
        ) : (
          sortedTasks.map((task, index) => (
            <Card
              key={task.id || index}
              className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-priority-${task.priority}`} />
              <CardHeader className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Task ID: {task.taskId}
                </div>
                <CardTitle className="flex justify-between items-start gap-2">
                  <span className="line-clamp-2 text-base">{task.title}</span>
                  <Badge
                    variant={task.status === "Finished" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {task.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority</span>
                  <Badge variant="outline" className={`text-priority-${task.priority}`}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      Start: {new Date(task.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      End: {new Date(task.endTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Total: {task.totalHours} hrs</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTask(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}