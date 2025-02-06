import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const favouriteNotes = await Note.find({ favourites: true });
      return res.status(200).json({ notes: favouriteNotes });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
