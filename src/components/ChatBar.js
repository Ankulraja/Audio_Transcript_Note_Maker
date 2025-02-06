import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Modal,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import { styled } from "@mui/system";
import axios from "axios";
import { uploadToCloudinary } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";

const RoundedButton = styled(Button)({
  borderRadius: "20px",
  textTransform: "none",
  padding: "6px 16px",
  backgroundColor: "#E53935",
  color: "white",
  "&:hover": {
    backgroundColor: "#D32F2F",
  },
});

export default function ChatBar({onNewNote}) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [openModal, setOpenModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const textFieldRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  let recognition = null;
  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCountdown(60);

      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript;
          setMessage((prev) => prev + " " + transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
        };

        recognition.start();
      }

      setTimeout(() => {
        stopRecording();
      }, 60000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  useEffect(() => {
    let timer;
    if (isRecording && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRecording, countdown]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [message]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveNote = async () => {
    let imageUrl = "";
    let audioUrl = "";
    setLoading(true);
    try {
      if (selectedImage) {
        const imgData = await uploadToCloudinary(
          selectedImage,
          "images",
          "image"
        );
        imageUrl = imgData;
      }

      if (audioBlob) {
        const audioFile = new File([audioBlob], "audio.mp3", {
          type: "audio/mp3",
        });
        const audioData = await uploadToCloudinary(audioFile, "audio", "raw");
        audioUrl = audioData;
      }

      const response = await axios.post("/api/notes/create", {
        title: noteTitle,
        content: message,
        imageUrl,
        audioUrl,
        userId: user._id,
      });

      setOpenModal(false);
      setMessage("");
      setNoteTitle("");
      setSelectedImage(null);
      setAudioBlob(null);
      onNewNote(response.data.note);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bar */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "white",
          borderRadius: 10,
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          px: 2,
          py: 1,
          width: "100%",
          maxWidth: isMobile ? "90%" : 800,
          overflowY: "auto",
          maxHeight: 150,
          scrollBehavior: "smooth",
          margin: "0 auto",
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={3}
          placeholder="Type or speak your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            flexGrow: 1,
            bgcolor: "white",
            px: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
            },
          }}
          inputRef={textFieldRef}
        />

        <IconButton component="label">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
          <ImageIcon sx={{ color: selectedImage ? "#E53935" : "#424242" }} />
        </IconButton>

        {!isRecording ? (
          <IconButton onClick={startRecording}>
            <MicIcon sx={{ color: "#424242" }} />
          </IconButton>
        ) : (
          <IconButton onClick={stopRecording}>
            <StopIcon sx={{ color: "#D32F2F" }} />
          </IconButton>
        )}

        {isRecording && (
          <Typography
            variant="body2"
            sx={{ ml: 2, fontWeight: "bold", color: "#E53935" }}
          >
            {countdown}s
          </Typography>
        )}

        {!isRecording && message.trim() && (
          <RoundedButton onClick={handleOpenModal}>
            <SendIcon sx={{ fontSize: "18px", mr: 1 }} />
            Send
          </RoundedButton>
        )}
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6">Enter Note Title</Typography>
          <TextField
            fullWidth
            placeholder="Title..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button
              onClick={handleSaveNote}
              variant="contained"
              color="primary"
              fullWidth
            >
              Save
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
}
