"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Helper function to format date into a readable format
const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];  // Format to YYYY-MM-DD
};

const AddTasks = () => {
  const [task, setTask] = useState({
    title: "",
    startTime: formatDate(new Date()),
    endTime: formatDate(new Date()),
    priority: 1,
    status: "pending",
  });
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addTasks/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); // Show success message
      router.push('/task-list'); // Redirect to tasks page after successful creation
      setTask({ title: "", startTime: "", endTime: "", priority: 1, status: "pending" }); // Clear form
    } else {
      alert(data.error); // Show error message
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Task Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={task.title}
            onChange={handleInputChange}
            className="w-full border p-2 mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
          <input
            id="startTime"
            name="startTime"
            type="date"
            value={task.startTime}
            onChange={handleInputChange}
            className="w-full border p-2 mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
          <input
            id="endTime"
            name="endTime"
            type="date"
            value={task.endTime}
            onChange={handleInputChange}
            className="w-full border p-2 mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleInputChange}
            className="w-full border p-2 mt-1"
            required
          >
            {[1, 2, 3, 4, 5].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleInputChange}
            className="w-full border p-2 mt-1"
            required
          >
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTasks;
