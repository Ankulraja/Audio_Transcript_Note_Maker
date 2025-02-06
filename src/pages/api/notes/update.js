import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    try {
      const {
        noteId,
        title,
        content,
        favourites,
        addImage = [],
        removeImage = [],
        addAudio = [],
        removeAudio = [],
      } = req.body;
      if (!noteId) {
        return res.status(400).json({ error: "Note ID is required." });
      }

      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({ error: "Note not found." });
      }

      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (favourites !== undefined) note.favourites = favourites;

      if (addImage.length > 0) {
        note.imageUrl.push(...addImage);
      }
      if (removeImage.length > 0) {
        note.imageUrl = note.imageUrl.filter(
          (img) => !removeImage.includes(img)
        );
      }

      if (addAudio.length > 0) {
        note.audios.push(...addAudio);
      }
      if (removeAudio.length > 0) {
        note.audios = note.audios.filter(
          (audio) => !removeAudio.includes(audio)
        );
      }

      const updatedNote = await note.save();

      return res
        .status(200)
        .json({ message: "Note updated successfully!", note: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
