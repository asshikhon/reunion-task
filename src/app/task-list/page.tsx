"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

interface Task {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  priority: string;
  status: string;
  email: string;
  totalTime: number;
}

const TaskListPage: React.FC = () => {
  const session = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortPriority, setSortPriority] = useState<string>('None');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  // Function to format date to your required format with AM/PM
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // This enables AM/PM format
    };
    return date.toLocaleString('en-US', options); // Use 'en-US' for AM/PM formatting
  };

  // Function to calculate total time between start and end time
  const calculateTotalTime = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end.getTime() - start.getTime();
    return diffInMs / (1000 * 60 * 60); // Convert from milliseconds to hours
  };

  // Function to fetch task data from the backend
  const loadData = useCallback(async () => {
    if (session?.data?.user?.email) {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task-list/api/${session?.data?.user?.email}`);
      const data = await resp.json();
      const tasksWithTotalTime = data?.myAddedTasks?.map((task: Task) => ({
        ...task,
        totalTime: calculateTotalTime(task.startTime, task.endTime),
      }));
      setTasks(tasksWithTotalTime || []);
      setFilteredTasks(tasksWithTotalTime || []);
      setIsLoading(false); // Set loading to false after data is loaded
    }
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (session?.data?.user?.email) {
      loadData();
    }
  }, [session?.data?.user?.email, loadData]);

  // Handle change for sorting by priority
  const handleSortPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortPriority(value);
    let sortedTasks = [...filteredTasks];

    if (value === "Priority: ASC") {
      sortedTasks.sort((a, b) => Number(a.priority) - Number(b.priority));
    } else if (value === "Priority: DESC") {
      sortedTasks.sort((a, b) => Number(b.priority) - Number(a.priority));
    } else {
      sortedTasks = filteredTasks; // If "None", reset to unsorted
    }

    setFilteredTasks(sortedTasks);
  };

  // Handle filtering tasks by Start and End Date
  const handleDateFilter = () => {
    let filtered = [...tasks];

    if (startDate) {
      filtered = filtered.filter((task) => {
        const taskStartDate = new Date(task.startTime).toISOString().split('T')[0];
        return taskStartDate >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter((task) => {
        const taskEndDate = new Date(task.endTime).toISOString().split('T')[0];
        return taskEndDate <= endDate;
      });
    }

    setFilteredTasks(filtered);
  };

  return (
    <div className="container mx-auto my-8 p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-200">Task List</h1>

      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <Link href={`/addTasks`}>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            + Add Task
          </button>
        </Link>

        <div className="flex gap-4 items-center">
          {/* Sort by Priority */}
          <div>
            <select
              value={sortPriority}
              onChange={handleSortPriority}
              className="p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
            >
              <option>Sort by Priority</option>
              <option>Priority: ASC</option>
              <option>Priority: DESC</option>
            </select>
          </div>

          {/* Filter by Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
            />
          </div>

          {/* Filter by End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
            />
          </div>

          <button
            onClick={handleDateFilter}
            className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Apply Date Filter
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center my-10">
          <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 w-12 h-12"></div>
        </div>
      ) : (
        <table className="w-full table-auto dark:text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="border px-4 py-2">Task ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Priority</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Start Time</th>
              <th className="border px-4 py-2">End Time</th>
              <th className="border px-4 py-2">Total Time (hrs)</th>
              <th className="border px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-700">
                <td className="border px-4 py-2 text-center">{task._id}</td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2 text-center">{task.priority}</td>
                <td className="border px-4 py-2 text-center">{task.status}</td>
                <td className="border px-4 py-2">{formatDate(task.startTime)}</td>
                <td className="border px-4 py-2">{formatDate(task.endTime)}</td>
                <td className="border px-4 py-2 text-center">{task.totalTime.toFixed(2)}</td>
                <td className="border px-4 py-2 text-center space-x-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-lg">
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskListPage;
