import { useState } from 'react';
import { Task } from '@/types';
import { TaskList } from '@/components/TaskList';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { AuthPage } from '@/components/auth/AuthPage';
import { Button } from '@/components/ui/button';

const initialTasks: Task[] = [
  {
    id: 'T-00001',
    title: 'Buy clothes',
    priority: 5,
    status: 'Pending',
    startTime: '2024-11-26T11:00',
    endTime: '2024-11-30T11:00',
    totalHours: 96
  },
  {
    id: 'T-00002',
    title: 'Finish code',
    priority: 2,
    status: 'Finished',
    startTime: '2024-11-25T09:05',
    endTime: '2024-11-25T15:15',
    totalHours: 6.17
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskId = `T-${String(tasks.length + 1).padStart(5, '0')}`;
    setTasks([...tasks, { ...newTask, id: taskId }]);
  };

  const handleDeleteSelected = (ids: string[]) => {
    setTasks(tasks.filter(task => !ids.includes(task.id)));
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    ));
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex space-x-4">
            <Button variant="link">Dashboard</Button>
            <Button variant="link">Task list</Button>
          </nav>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Task list</h1>
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>

          <TaskList
            tasks={tasks}
            onDeleteSelected={handleDeleteSelected}
            onEdit={handleEditTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;