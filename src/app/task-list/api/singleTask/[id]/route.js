import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";



export const DELETE = async (request, {params}) => {
  try {
      const db = await connectDB();
      const resortRoomCollection = await db.collection('resortRoom');
      console.log("Deleting resort room with ID:", params.id);  // Debugging log

      const resp = await resortRoomCollection.deleteOne({_id: new ObjectId(params.id)});
      if (resp.deletedCount > 0) {
          return NextResponse.json({message: 'Successfully deleted the resort room', response: resp});
      } else {
          return NextResponse.json({message: 'No resort room found to delete', response: resp});
      }
  } catch (error) {
      console.error("Error deleting resort room:", error);  // Log the error for debugging
      return NextResponse.json({message: 'Something went wrong', error: error.message});
  }
};


export const PATCH = async (request, { params }) => {
  try {
    const db = await connectDB();
    const resortRoomCollection = await db.collection('resortRoom');

    // Parse the incoming request body
    const updateDoc = await request.json();

    // Perform the update operation
    const resp = await resortRoomCollection.updateOne(
      { _id: new ObjectId(params.id) }, // Match by ID
      { $set: updateDoc }, // Update document
      { upsert: true } // Create a new document if no match is found
    );

    // Respond with success
    return NextResponse.json({ message: 'Resort Room updated successfully', response: resp });
  } catch (error) {
    console.error('Error updating the Resort Room:', error);
    // Respond with error message
    return NextResponse.json({ message: 'Something went wrong', error: error.message });
  }
};





export const GET = async (request, { params }) => {
  try {
    const db = await connectDB();
    const resortRoomCollection = db.collection("resortRoom");

    const resp = await resortRoomCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!resp) {
      return NextResponse.json({ message: "Resort Room not found", data: null });
    }

    return NextResponse.json({ message: "Resort Room Found", data: resp });
  } catch (error) {
    console.error("Error fetching Resort Room:", error);
    return NextResponse.json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};