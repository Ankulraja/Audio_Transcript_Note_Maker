import dbConnect from "../../../lib/dbConnect";
import Note from "../../../models/notes";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { title, content, imageUrl, audioUrl,favourites,userId} = req.body;
    console.log("...UserId ...",userId);
      const newNote = new Note({
        title,
        content,
        imageUrl: imageUrl || [],
        audios: audioUrl || [],
        favourites: favourites || false,
        user:userId
      });

      await newNote.save();
      return res.status(201).json({ message: "Note saved successfully!", note: newNote });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}