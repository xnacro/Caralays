const express = require("express");
const app = express();
const env = require("dotenv");
const cookieParser = require("cookie-parser");
env.config();

const path = require("path");
const http = require("http");
const WebSocket = require("ws");

// routes 
const authRoutes = require("./routes/authRoute");


// middleware   
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send("Connected to WebSocket Server");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

const port = process.env.PORT;
server.listen(port, () => {
   console.log(`HTTP + WebSocket server running on port ${port}`);
});