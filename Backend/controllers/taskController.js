const Task = require("../models/taskModel");
const Counter = require("../models/counterModel");

const calculateTotalHours = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Number((diff / (1000 * 60 * 60)).toFixed(2));
};

const createTask = async (req, res) => {
  const { title, startTime, endTime, priority, status } = req.body;
  try {
    let counter = await Counter.findOne({ userId: req.user.id });
    if (!counter) {
      counter = await Counter.create({ userId: req.user.id, taskId: 0 });
    }

    // Get the maximum taskId from the existing tasks for the user
    const lastTask = await Task.findOne({ user: req.user.id })
      .sort({ taskId: -1 })
      .limit(1);

    // If no tasks exist, start from taskId 1, else increment from the last task's taskId
    const taskId = lastTask ? lastTask.taskId + 1 : 1;

    const totalHours = calculateTotalHours(startTime, endTime);
    const task = await Task.create({
      user: req.user.id,
      title,
      startTime,
      endTime,
      priority,
      status,
      taskId,
    });

    // Update the counter if necessary
    counter.taskId = taskId;
    await counter.save();

    res.status(201).json({ ...task.toObject(), totalHours });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getTasks = async (req, res) => {
  const { priority, status, sortBy } = req.query;
  const query = { user: req.user.id };
  if (priority) query.priority = priority;
  if (status) query.status = status;

  try {
    const tasks = await Task.find(query).sort({ [sortBy || "startTime"]: 1 });

    const tasksWithTotalTime = tasks.map((task) => {
      
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);

      const totalMilliseconds = endTime - startTime;

     
      const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(2);

      return {
        ...task.toObject(),  
        totalHours,  
      };
    });

    // Return the tasks with the total time in the response
    res.json(tasksWithTotalTime);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  const { status, endTime, priority } = req.body;

  try {
    // Prepare the update object with the fields to update
    const updateFields = {};
    if (status) {
      updateFields.status = status;
      if (status === "finished") {
        updateFields.endTime = new Date(); // Set endTime if status is finished
      }
    }
    if (priority !== undefined) updateFields.priority = priority; // Only update if provided
    if (endTime) updateFields.endTime = endTime; // Use provided endTime if given

    // Update the task with the provided fields
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure the task belongs to the user
      updateFields, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.json(updatedTask); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getStatistics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Finished"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending"
    ).length;

    let totalTimeLapsed = 0;
    let totalTimeToFinish = 0;

    const statsByPriority = tasks.reduce((acc, task) => {
      const priority = task.priority;

      // Handle Pending tasks
      if (task.status === "Pending") {
        // Ensure startTime and endTime are valid dates
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);
        const currentTime = new Date();

        if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
          // Time Lapsed: If current time < start time, then set to 0
          const timeLapsed =
            currentTime < startTime ? 0 : (currentTime - startTime) / 3600000; // in hours
          const timeLeft =
            currentTime > endTime ? 0 : (endTime - currentTime) / 3600000; // in hours

          totalTimeLapsed += timeLapsed;
          totalTimeToFinish += timeLeft;

          // Initialize priority object if not already present
          if (!acc[priority]) {
            acc[priority] = {
              pendingCount: 0,
              completedCount: 0,
              timeLapsed: 0,
              timeLeft: 0,
            };
          }

          // Increment pending task count and accumulate time data
          acc[priority].pendingCount += 1;
          acc[priority].timeLapsed += timeLapsed;
          acc[priority].timeLeft += timeLeft;
        }
      }

      // Handle Finished tasks
      else if (task.status === "Finished") {
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);

        if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
          const timeTaken = (endTime - startTime) / 3600000; // in hours

          // Initialize priority object if not already present
          if (!acc[priority]) {
            acc[priority] = {
              pendingCount: 0,
              completedCount: 0,
              totalTimeTaken: 0,
            };
          }

          // Accumulate finished task time data
          acc[priority].completedCount += 1;
          acc[priority].totalTimeTaken += timeTaken;
        }
      }

      return acc;
    }, {});

    const averageTime =
      tasks
        .filter((task) => task.status === "Finished")
        .reduce((acc, task) => {
          const startTime = new Date(task.startTime);
          const endTime = new Date(task.endTime);
          if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
            return acc + (endTime - startTime) / 3600000;
          }
          return acc;
        }, 0) / (completedTasks || 1);

    res.json({
      totalTasks,
      completedPercentage:
        totalTasks > 0
          ? ((completedTasks / totalTasks) * 100).toFixed(2)
          : "0.00",
      pendingPercentage:
        totalTasks > 0
          ? ((pendingTasks / totalTasks) * 100).toFixed(2)
          : "0.00",
      totalPendingTasks: pendingTasks,
      statsByPriority,
      totalTimeLapsed: totalTimeLapsed.toFixed(2),
      totalTimeToFinish: totalTimeToFinish.toFixed(2),
      averageTime: averageTime.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


 

 


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getStatistics,
};
