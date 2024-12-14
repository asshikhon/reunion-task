import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { Collection } from "mongodb";

// Define the type for the task object
interface Task {
  title: string;
  startTime: string;
  endTime: string;
  priority: number;
  status: string;
  email: string;
}

export const GET = async (request: Request, { params }: { params: { email: string } }) => {
  const db = await connectDB();  // db might be undefined
  if (!db) {
    return NextResponse.json({ error: 'Database connection failed.' });
  }

  const tasksCollection: Collection<Task> = db.collection('tasks');
  
  // Get the status from query params (if available)
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status') || 'All';  // Default to 'All'

  try {
    let query: { email: string; status?: string } = { email: params.email };

    // If status filter is not 'All', add it to the query
    if (statusFilter !== 'All') {
      query.status = statusFilter;
    }

    const myAddedTasks: Task[] = await tasksCollection.find(query).toArray();
    return NextResponse.json({ myAddedTasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching tasks.' });
  }
};
