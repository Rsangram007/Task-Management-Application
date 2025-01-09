import { ReactNode } from "react";

export interface Task {
  _id: any;
  taskId: ReactNode;
  id: string;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  startTime: string;
  endTime: string;
  totalHours: number;
}

export interface SortOption {
  field: 'startTime' | 'endTime';
  direction: 'ASC' | 'DESC';
}