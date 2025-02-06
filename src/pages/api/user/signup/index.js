import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/userModel";
import bcrypt from "bcryptjs";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  await dbConnect();
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully!", success: true });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
