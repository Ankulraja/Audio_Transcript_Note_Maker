"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Button, Typography } from "@mui/material";
import NoteCard from "./NoteCard";
import { useAuth } from "../context/AuthContext";

export default function NoteSection({
  selectedFilter,
  searchQuery,
  sortOrder,
  newNotes,
  onNewNote,
}) {
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNotes() {
      try {
        let endpoint = "/api/notes/get";
        let params = { sortOrder };

        if (selectedFilter === "Home") {
          params.userId = user._id;
        } else if (selectedFilter === "Favourites") {
          params.userId = user._id;
          params.favourites = true;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await axios.get(endpoint, { params });
        setNotes(response.data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }

    fetchNotes();
  }, [selectedFilter, searchQuery, sortOrder, newNotes]);

  const handleDeleteNote = (deletedNoteId) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note._id !== deletedNoteId)
    );
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  const handleCreateNote = () => {
    onNewNote();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
      {notes.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Notes are present
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNote}
          >
            Create a Note
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="start">
          {notes.map((note) => (
            <Grid item key={note._id} xs={12} sm={6} md={4} lg={3}>
              <NoteCard
                note={note}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
