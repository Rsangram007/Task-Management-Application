

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "../components/ui/table";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token from storage
        const response = await fetch(
          "http://localhost:5000/api/tasks/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in request header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
console.log("data",stats)
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card for Total Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>

        {/* Card for Completed Tasks Percentage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Tasks completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedPercentage}%
            </div>
          </CardContent>
        </Card>

        {/* Card for Pending Tasks Percentage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tasks pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPercentage}%</div>
          </CardContent>
        </Card>

        {/* Card for Average Time Per Completed Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average time per completed task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTime} hrs</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Task Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Pending task summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalPendingTasks}
                </div>
                <div className="text-xs text-muted-foreground">
                  Pending tasks
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalTimeLapsed} hrs
                </div>
                <div className="text-xs text-muted-foreground">
                  Total time lapsed
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalTimeToFinish} hrs
                </div>
                <div className="text-xs text-muted-foreground">
                  Total time to finish
                </div>
                <div className="text-xs text-muted-foreground italic">
                  estimated based on endtime
                </div>
              </div>
            </div>

            {/* Table for Pending Tasks by Priority */}
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Task priority</TableHead>
                  <TableHead>Pending tasks</TableHead>
                  <TableHead>Time lapsed (hrs)</TableHead>
                  <TableHead>Time to finish (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(stats.statsByPriority).map((priority: any) => (
                  <TableRow key={priority}>
                    <TableCell>{priority}</TableCell>
                    <TableCell>
                      {stats.statsByPriority[priority].pendingCount}
                    </TableCell>
                    <TableCell>
                      {stats.statsByPriority[priority].timeLapsed
                        ? stats.statsByPriority[priority].timeLapsed.toFixed(0)
                        : "0"}
                    </TableCell>
                    <TableCell>
                      {stats.statsByPriority[priority].timeLeft
                        ? stats.statsByPriority[priority].timeLeft.toFixed(0)
                        : "0"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
