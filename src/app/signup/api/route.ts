import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Collection, Document } from "mongodb";

// Define the structure of the incoming request payload
interface NewUser {
  email: string;
  password: string;
  name: string;
}

export const POST = async (request: Request): Promise<NextResponse> => {
  // Parse the incoming JSON body
  const newUser: NewUser = await request.json();

  try {
    // Connect to the database
    const db = await connectDB();
    if (!db) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    // Get the users collection
    const userCollection: Collection<Document> = db.collection("users");

    // Check if the user already exists
    const exist = await userCollection.findOne({ email: newUser.email });
    if (exist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(newUser.password, 14);

    // Insert the new user into the database
    const resp = await userCollection.insertOne({
      ...newUser,
      password: hashedPassword,
    });

    console.log(resp);
    return NextResponse.json(
      { message: "User Created" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
