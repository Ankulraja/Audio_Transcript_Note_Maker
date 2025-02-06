"use client";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";

export default function FilterBar({ onSearch, onSort }) {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = (sortType) => {
    setAnchorEl(null);
    if (sortType) {
      onSort(sortType);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(0, 0, 0, 0.06)",
        borderRadius: 5,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        px: 2,
        py: 1,
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <TextField
        variant="standard"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#BDBDBD" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          borderRadius: 5,
          px: 1,
          py: 1,
          maxWidth: "650px",
        }}
      />

      <IconButton onClick={handleSortClick}>
        <SortIcon sx={{ color: "#424242" }} />
        <Typography sx={{ fontSize: "14px", color: "#424242" }}>
          Sort
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleSortClose(null)}
      >
        <MenuItem onClick={() => handleSortClose("asc")}>
          A-Z (New to Old)
        </MenuItem>
        <MenuItem onClick={() => handleSortClose("desc")}>
          Z-A (Old to New)
        </MenuItem>
      </Menu>
    </Box>
  );
}
