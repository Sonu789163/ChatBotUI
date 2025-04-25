import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FlightIcon from "@mui/icons-material/Flight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandIcon from "@mui/icons-material/PanTool";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#006838", // Dark green color
    },
    secondary: {
      main: "#808080", // Gray color for user messages
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7F7F8",
    },
    text: {
      primary: "#374151",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function SayHaloChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const [isInitialView, setIsInitialView] = useState(true);

  useEffect(() => {
    if (messages.length > 0 && isInitialView) {
      setIsInitialView(false);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBotThinking(true);

    try {
      const res = await fetch(
        "https://sonu7891.app.n8n.cloud/webhook-test/3827bee2-24fa-4c77-8643-0f0dba094ae7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );

      const responseData = await res.json();
      const { output } = responseData;
      setIsBotThinking(false);
      setMessages((prev) => [...prev, { type: "bot", text: output }]);
    } catch (err) {
      setIsBotThinking(false);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            display: isInitialView ? "block" : "none",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "medium" }}>
            Hello
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
            How can I help you today?
          </Typography>
        </Box>

        {/* Chat Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            mb: isInitialView ? 2 : 10,
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",  // Firefox
            msOverflowStyle: "none",  // IE and Edge
          
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                mb: 2,
                gap: 1,
              }}
            >
              {msg.type === "bot" && (
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 28,
                    height: 28,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  borderRadius: 2,
                  bgcolor:
                    msg.type === "user" ? "primary.main" : "background.paper",
                  color: msg.type === "user" ? "white" : "text.primary",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              {msg.type === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 28,
                    height: 28,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
            </Box>
          ))}
          {isBotThinking && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 28,
                  height: 28,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={16} color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          elevation={3}
          sx={{
            position: "fixed",
            bottom: isInitialView ? "50%" : 0,
            left: 0,
            right: 0,
            p: 2,
            transform: isInitialView ? "translateY(50%)" : "none",
            transition: "all 0.3s ease-in-out",
            bgcolor: "background.default",
            borderTop: isInitialView ? "none" : "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Container maxWidth="md">
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
              elevation={0}
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <TextField
                sx={{
                  ml: 1,
                  flex: 1,
                  "& .MuiInputBase-root": {
                    padding: "8px 0",
                  },
                }}
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
              />
              <IconButton
                sx={{
                  p: "10px",
                  color: input.trim() ? "primary.main" : "text.disabled",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  ml: 1,
                }}
                aria-label="send"
                onClick={sendMessage}
                disabled={!input.trim()}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Container>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
