"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: "T-00001",
      title: "Buy clothes",
      priority: 5,
      status: "Pending",
      startTime: "26-Nov-24 11:00 AM",
      endTime: "30-Nov-24 11:00 AM",
      totalTime: 96,
    },
    {
      id: "T-00002",
      title: "Finish code",
      priority: 2,
      status: "Finished",
      startTime: "25-Nov-24 09:05 AM",
      endTime: "25-Nov-24 03:15 PM",
      totalTime: 6.17,
    },
    {
      id: "T-00003",
      title: "Book travel tickets",
      priority: 4,
      status: "Pending",
      startTime: "19-Nov-24 10:00 PM",
      endTime: "20-Nov-24 11:00 PM",
      totalTime: 25,
    },
    {
      id: "T-00004",
      title: "Order groceries",
      priority: 3,
      status: "Finished",
      startTime: "14-Oct-24 10:30 AM",
      endTime: "16-Oct-24 10:30 PM",
      totalTime: 60,
    },
    {
      id: "T-00005",
      title: "Medical checkup",
      priority: 1,
      status: "Pending",
      startTime: "19-Nov-24 01:15 PM",
      endTime: "21-Dec-24 05:00 PM",
      totalTime: 51.75,
    },
  ]);

  return (
    <div className="container mx-auto my-8 p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-200">Task List</h1>

      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <button className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          + Add Task
        </button>
        <button className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
          Delete Selected
        </button>
        <div className="flex gap-4 items-center">
          <div>
            <select className="p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
              <option>Sort by Priority</option>
              <option>Priority: ASC</option>
              <option>Priority: DESC</option>
              <option>Start Time: ASC</option>
              <option>Start Time: DESC</option>
              <option>End Time: ASC</option>
              <option>End Time: DESC</option>
            </select>
          </div>
          <div>
            <select className="p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
              <option>Status: All</option>
              <option>Status: Pending</option>
              <option>Status: Finished</option>
            </select>
          </div>
        </div>
      </div>

      <table className="w-full table-auto dark:text-gray-300">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-4 py-2">Select</th>
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
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-700">
              <td className="border px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2 text-center">{task.id}</td>
              <td className="border px-4 py-2">{task.title}</td>
              <td className="border px-4 py-2 text-center">{task.priority}</td>
              <td className="border px-4 py-2 text-center">{task.status}</td>
              <td className="border px-4 py-2">{task.startTime}</td>
              <td className="border px-4 py-2">{task.endTime}</td>
              <td className="border px-4 py-2 text-center">{task.totalTime}</td>
              <td className="border px-4 py-2 text-center">
                <button className="text-blue-500 hover:text-blue-700">
                  <FiEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListPage;
