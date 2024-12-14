import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";
import { Db, Collection, Document } from "mongodb";

// Define types for the request body
interface NewUser {
  email: string;
  password: string;
  userType: string;
  name: string;
  resortName?: string;  // Make resortName and location optional
  location?: string;    // Make location optional
}

export const POST = async (request: Request): Promise<Response> => {
  const newUser: NewUser = await request.json();

  try {
    // Connect to the database
    const db: Db | undefined = await connectDB();
    if (!db) {
      return new Response(
        JSON.stringify({ message: "Database connection failed" }),
        { status: 500 }
      );
    }

    const userCollection: Collection<Document> = db.collection('users');
    const reunionsCollection: Collection<Document> = db.collection('reunions');

    // Check if the user already exists
    const exist = await userCollection.findOne({ email: newUser.email });
    if (exist) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 409 }  // Use 409 Conflict for existing users
      );
    }

    // Hash the password asynchronously using bcrypt.hash
    const hashedPassword = await bcrypt.hash(newUser.password, 14);

    // Insert the new user into the users collection
    const resp = await userCollection.insertOne({
      ...newUser,
      password: hashedPassword,
    });

    console.log(resp);  // You can remove or keep this depending on debugging needs

    // If userType is "reunionManager", insert into the reunions collection
    if (newUser.userType === "reunionManager") {
      const { resortName, location } = newUser; // Extract only the relevant properties for reunion

      if (resortName && location) {
        // Resort data should contain fields specific to the resort, not the user
        await reunionsCollection.insertOne({
          resortName,
          location,
        });
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }  // Use 201 Created for successful resource creation
    );
  } catch (error) {
    // Check if error is an instance of Error and use error.message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ message: "Something went wrong", error: errorMessage }),
      { status: 500 }
    );
  }
};
