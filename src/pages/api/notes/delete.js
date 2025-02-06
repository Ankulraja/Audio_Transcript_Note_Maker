import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { noteId } = req.body;

      if (!noteId) {
        return res.status(400).json({ error: "Note ID is required." });
      }

      const deletedNote = await Note.findByIdAndDelete(noteId);

      if (!deletedNote) {
        return res.status(404).json({ error: "Note not found." });
      }

      return res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
