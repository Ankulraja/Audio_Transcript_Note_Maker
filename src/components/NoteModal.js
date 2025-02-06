"use client";
import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { format } from "date-fns";
import { uploadToCloudinary } from "../utils/cloudinary";

export default function NoteModal({ open, handleClose, note, onUpdate }) {
  const [title, setTitle] = useState(note.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.favourites);
  const [tabIndex, setTabIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(note.imageUrl || []);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialNoteRef = useRef(note);

  useEffect(() => {
    const isTitleChanged = title !== initialNoteRef.current.title;
    const isFavoriteChanged = isFavorite !== initialNoteRef.current.favourites;
    const areImagesChanged =
      JSON.stringify(uploadedImages) !==
      JSON.stringify(initialNoteRef.current.imageUrl);

    setHasChanges(isTitleChanged || isFavoriteChanged || areImagesChanged);
  }, [title, isFavorite, uploadedImages]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imgData = await uploadToCloudinary(file, "images", "image");
        setUploadedImages((prevImages) => [...prevImages, imgData]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageDelete = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);

    const addImage = uploadedImages.filter(
      (img) => !initialNoteRef.current.imageUrl.includes(img)
    );
    const removeImage = initialNoteRef.current.imageUrl.filter(
      (img) => !uploadedImages.includes(img)
    );

    const updateData = {
      noteId: note._id,
      title,
      favourites: isFavorite,
      addImage: addImage.length > 0 ? addImage : undefined,
      removeImage: removeImage.length > 0 ? removeImage : undefined,
    };

    try {
      const response = await fetch("/api/notes/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        onUpdate(updatedNote.note);
        setHasChanges(false);

        initialNoteRef.current = updatedNote.note;
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} fullScreen={isFullscreen}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isFullscreen
            ? "100vw"
            : { xs: "90vw", sm: "80vw", md: "800px" },
          maxHeight: "100vh",
          height: isFullscreen ? "100vh" : "inherit",
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
            <FullscreenIcon />
          </IconButton>
          <Box display="flex">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" alignItems="center">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                style={{
                  fontSize: "1.2rem",
                  border: "none",
                  outline: "none",
                  flex: 1,
                }}
              />
            ) : (
              <Typography variant="h6">{title}</Typography>
            )}
            <IconButton onClick={() => setIsEditingTitle(!isEditingTitle)}>
              {isEditingTitle ? <CheckIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          <Typography variant="body2" color="textSecondary">
            {format(new Date(note.createdAt), "MMM dd, yyyy • h:mm a")}
          </Typography>
        </Box>

        {note.audios.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {note.audios.map((audio, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <audio controls style={{ flex: 1 }}>
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Tooltip title="Download Audio">
                  <IconButton component="a" href={audio} download>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}

        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          sx={{ mt: 2 }}
        >
          <Tab label="Notes" />
          <Tab label="Transcript" />
          <Tab label="Create" />
          <Tab label="Speak Transcript" />
        </Tabs>

        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-line", flex: 1 }}
            >
              {showFullContent
                ? note.content
                : `${note.content.substring(0, 100)}...`}
            </Typography>

            <Tooltip title="Copy Content">
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            size="small"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? "Read Less" : "Read More"}
          </Button>
        </Box>

        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
          {uploadedImages.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 60,
                height: 60,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #ddd",
                "&:hover .delete-icon": {
                  opacity: 1,
                },
              }}
            >
              <img
                src={img}
                alt="Uploaded"
                style={{ width: "100%", height: "100%" }}
              />
              <IconButton
                className="delete-icon"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
                onClick={() => handleImageDelete(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <IconButton component="label">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="upload-image"
            />
            <CloudUploadIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanges || loading}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Saving
                <Box
                  sx={{
                    display: "flex",
                    gap: "2px",
                    "& > div": {
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      animation: "glow 1.4s infinite",
                      "&:nth-child(1)": { animationDelay: "0s" },
                      "&:nth-child(2)": { animationDelay: "0.2s" },
                      "&:nth-child(3)": { animationDelay: "0.4s" },
                    },
                  }}
                >
                  <div />
                  <div />
                  <div />
                </Box>
              </Box>
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
