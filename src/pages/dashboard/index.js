import { useState } from "react";
import { Box } from "@mui/material";
import SideBar from "../../components/SideBar";
import FilterBar from "../../components/Filter";
import ChatBar from "../../components/ChatBar";
import protectedRoute from "../../utils/protectedRoute";
import NoteSection from "../../components/NoteSection";

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [notes, setNotes] = useState([]);

  const handleNewNote = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  return (
    <Box sx={{ height: "calc(100vh - 65px)" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Box sx={{ height: "100%", width: "18%" }}>
          <SideBar onSelectFilter={setSelectedFilter} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", position: "relative" }}>
          <Box sx={{ minHeight: "10%", width: "100%" }}>
            <FilterBar onSearch={setSearchQuery} onSort={setSortOrder} />
          </Box>
          <Box sx={{ height: "90%", overflowY: "scroll",paddingBottom:"100px" }}>
            <NoteSection 
              selectedFilter={selectedFilter} 
              searchQuery={searchQuery} 
              sortOrder={sortOrder} 
              newNotes={notes} 
              onNewNote={handleNewNote}
            />
          </Box>
          <Box
            sx={{
              // maxHeight: "10%",
              width: "70%",
              position: "absolute",
              zIndex:"10px",
              bottom: 16,
              display: "flex",
              justifyContent: "center",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <ChatBar onNewNote={handleNewNote} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default protectedRoute(Index);