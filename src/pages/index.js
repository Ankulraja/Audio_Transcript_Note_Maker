import { Container, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Hello, Tarsense Technologies Private Limited
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Hi, I am Ankul Raja Patel
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is my interactive landing page. Please sign up or log in to see my
        assignment work.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => router.push("/sign-up")}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}
