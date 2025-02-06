import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { userId, favourites, search, sortOrder } = req.query;
      let filter = {};

      if (userId) {
        filter.user = userId;
      }

      if (favourites !== undefined) {
        filter.favourites = favourites === "true";
      }

      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      const sortOptions =
        sortOrder === "asc" ? { createdAt: -1 } : { createdAt: 1 };

      const notes = await Note.find(filter).sort(sortOptions);

      return res.status(200).json({ notes });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
