"use client";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ListIcon from "@mui/icons-material/List";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    name: "Home",
    icon: <HomeIcon sx={{ color: "#673AB7" }} />,
  },
  {
    name: "Favourites",
    icon: <StarBorderIcon sx={{ color: "#673AB7" }} />,
  },
];

export default function Sidebar({ onSelectFilter }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selected, setSelected] = useState("Home");
  const [expanded, setExpanded] = useState(false);
  const { user, logout } = useAuth();

  const handleMenuClick = (item) => {
    setSelected(item.name);
    onSelectFilter(item.name);
  };

  return (
    <Box
      sx={{
        width: isMobile ? 80 : 250,
        height: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #E0E0E0",
        p: 1,
        position: "relative",
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleMenuClick(item)}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: selected === item.name ? "#E3F2FD" : "transparent",
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {!isMobile && (
              <ListItemText
                primary={item.name}
                sx={{ color: "#673AB7", fontWeight: "bold" }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ position: "relative", p: 1 }}>
        {expanded && (
          <Box
            sx={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              width: "100%",
              bgcolor: "white",
              boxShadow: 2,
              borderRadius: 1,
              p: 1,
              mb: 1,
              zIndex: 10,
              textAlign: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ mt: 1, width: "100%" }}
              onClick={logout}
            >
              Logout
            </Button>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {user?.email}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Avatar sx={{ bgcolor: "#424242" }}>
            {user?.username ? user?.username.charAt(0).toUpperCase() : ""}
          </Avatar>
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, ml: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {user?.username}
                </Typography>
              </Box>
              <ExpandMoreIcon
                sx={{
                  color: "#424242",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.3s ease",
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
