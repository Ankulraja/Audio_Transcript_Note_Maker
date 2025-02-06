"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Modal,
  Button,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import NoteModal from "./NoteModal";

export default function NoteCard({ note, onDelete, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState("00:00");
  const [isFavorite, setIsFavorite] = useState(note.favourites);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!note.audios.length) return;

    const audioElement = new Audio(note.audios[0]);
    audioRef.current = audioElement;

    const handleMetadata = () => {
      setAudioTime("00:00");
    };

    audioElement.addEventListener("loadedmetadata", handleMetadata);
    return () => {
      audioElement.removeEventListener("loadedmetadata", handleMetadata);
      audioElement.pause();
      clearInterval(intervalRef.current);
    };
  }, [note.audios]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleAudioToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    } else {
      audioRef.current.play();
      intervalRef.current = setInterval(() => {
        setAudioTime(formatTime(audioRef.current.currentTime));
      }, 1000);
    }

    setIsPlaying(!isPlaying);
  };

  const handleFavoriteToggle = async () => {
    const newFavoriteStatus = !isFavorite;
    try {
      setIsFavorite(newFavoriteStatus);
      await axios.put("/api/notes/update", {
        noteId: note._id,
        favourites: newFavoriteStatus,
      });
      onUpdate({ ...note, favourites: newFavoriteStatus });
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setIsFavorite(!newFavoriteStatus);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/api/notes/delete", {
        data: { noteId: note._id },
      });
      setIsDeleteModalOpen(false);
      onDelete(note._id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: 350,
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        <CardContent
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            {format(new Date(note.createdAt), "MMM dd, yyyy • h:mm a")}
          </Typography>

          {note.audios.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <IconButton
                size="small"
                sx={{ color: "black" }}
                onClick={handleAudioToggle}
              >
                {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
              </IconButton>
              <Typography variant="caption" fontWeight="bold">
                {audioTime}
              </Typography>
            </Box>
          )}

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mt: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {note.title}
          </Typography>

          <Tooltip>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                flex: 1,
              }}
            >
              {note.content}
            </Typography>
          </Tooltip>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Chip
            icon={<ImageIcon />}
            label={`${note.imageUrl.length} Image${
              note.imageUrl.length > 1 ? "s" : ""
            }`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: "bold" }}
          />

          <Box>
            <IconButton
              size="small"
              sx={{ color: "gray" }}
              onClick={() => setOpen(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "gray" }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to delete this note?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Note Modal */}
      <NoteModal
        open={open}
        handleClose={() => setOpen(false)}
        note={note}
        onUpdate={onUpdate}
      />
    </>
  );
}
