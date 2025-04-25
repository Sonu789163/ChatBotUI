import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
  AppBar,
  Toolbar,
  Switch,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Create theme function
const createAppTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#f7f0e8" : "#2C1810",
        light: darkMode ? "#f0e6dc" : "#FAF6F3",
        dark: darkMode ? "#f7f0e8" : "#1A0F0A",
      },
      secondary: {
        main: darkMode ? "#FFFFFF" : "#2C1810",
      },
      background: {
        default: darkMode ? "#1a1a1a" : "#FAF6F3",
        paper: darkMode ? "rgba(255,255,255,0.05)" : "rgba(44, 24, 16, 0.04)",
      },
      text: {
        primary: darkMode ? "#FFFFFF" : "#2C1810",
        secondary: darkMode ? "rgba(255,255,255,0.7)" : "rgba(44, 24, 16, 0.7)",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        color: "#2C1810",
        fontWeight: 500,
      },
      h6: {
        color: "rgba(44, 24, 16, 0.7)",
        fontWeight: 400,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px 20px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "& .MuiSwitch-track": {
              backgroundColor: "rgba(44, 24, 16, 0.2)",
            },
          },
        },
      },
    },
  });

export default function OrangeChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isInitialView, setIsInitialView] = useState(true);

  // Initialize darkMode from localStorage or default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const messagesEndRef = useRef(null);
  const theme = createAppTheme(darkMode);

  // Remove the prefersDarkMode hook since we want to control it manually
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 && isInitialView) {
      setIsInitialView(false);
    }
    scrollToBottom();
  }, [messages, isInitialView]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBotThinking(true);

    try {
      const res = await fetch(
        "https://sonu789163.app.n8n.cloud/webhook/3827bee2-24fa-4c77-8643-0f0dba094ae7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );

      const reply = await res.text();
      const parsed = JSON.parse(reply);
      const output = parsed[0]?.output || "Sorry, no response received.";

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
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(250, 246, 243, 0.8)"
              : "rgba(26, 26, 26, 0.8)",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "text.primary" }}
            >
              Art Support Agent
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {darkMode ? (
                <Brightness7Icon sx={{ color: "text.primary" }} />
              ) : (
                <Brightness4Icon sx={{ color: "text.primary" }} />
              )}
              <Switch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                color="default"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          p: 0,
          pt: 8, // Add padding top to account for AppBar
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            mb: 4,
            display: isInitialView ? "block" : "none",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#f0e6dc",
              color: "#808080",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "text.primary", mb: 2 }}
          >
            Art Support Agent
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            How can I help you today?
          </Typography>
        </Box>

        {/* Chat Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 3,
            pb: messages.length > 0 ? 10 : 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                mb: 4,
                gap: 2,
              }}
            >
              {msg.type === "bot" && (
                <Avatar
                  sx={{
                    bgcolor: "#f0e6dc",
                    color: "#808080",
                    width: 28,
                    height: 28,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  maxWidth: "80%",
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {msg.text}
                </Typography>
              </Paper>
              {msg.type === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "#f0e6dc",
                    color: "#808080",
                    width: 28,
                    height: 28,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 20 }} />
                </Avatar>
              )}
            </Box>
          ))}
          {isBotThinking && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                mb: 4,
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={16} color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Paper>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 28,
                  height: 28,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            position: "fixed",
            bottom: isInitialView ? "50%" : 0,
            left: 0,
            right: 0,
            p: 2,
            transform: isInitialView ? "translateY(50%)" : "none",
            transition: "all 0.3s ease-in-out",
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="sm">
            <Paper
              component="form"
              sx={{
                p: "2px 12px",
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              elevation={0}
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <TextField
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    padding: "8px 0",
                    color: "text.primary",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.secondary",
                    opacity: 1,
                  },
                }}
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
              />
              <IconButton
                sx={{
                  p: 1,
                  color: input.trim()
                    ? (theme) =>
                        theme.palette.mode === "light"
                          ? theme.palette.primary.main
                          : theme.palette.text.primary
                    : "text.secondary",
                  transition: "color 0.2s",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(44, 24, 16, 0.04)"
                        : "rgba(255, 255, 255, 0.04)",
                  },
                }}
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
