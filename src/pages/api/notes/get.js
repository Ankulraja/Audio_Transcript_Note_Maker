import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { userId, favourites, search, sortOrder } = req.query;
      let filter = {};

      // Filter by userId if provided
      if (userId) {
        filter.user = userId;
      }

      // Filter by favourites (convert string to boolean)
      if (favourites !== undefined) {
        filter.favourites = favourites === "true";
      }

      // Search notes by title (case-insensitive)
      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      // Sorting logic
      const sortOptions = sortOrder === "asc" ? { createdAt: -1 } : { createdAt: 1 };

      // Fetch notes based on filters & sorting
      const notes = await Note.find(filter).sort(sortOptions);

      return res.status(200).json({ notes });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}