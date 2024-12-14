import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { Db } from "mongodb";  // Import MongoDB types for better type safety

export const POST = async (req: Request) => {
  try {
    const db: Db | undefined = await connectDB(); // Ensure db is properly typed

    if (!db) {
      // If the db is undefined, return an error
      return NextResponse.json(
        { error: "Failed to connect to the database." },
        { status: 500 }
      );
    }

    const tasksCollection = db.collection("tasks");

    const body = await req.json();

    // Validation
    const { title, startTime, endTime, priority, status } = body;
    if (!title || !startTime || !endTime || !priority || !status) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (priority < 1 || priority > 5) {
      return NextResponse.json(
        { error: "Priority must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Insert the task into MongoDB
    const result = await tasksCollection.insertOne({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      priority,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Task Added Successfully!", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json(
      { error: "Failed to add the task." },
      { status: 500 }
    );
  }
};
