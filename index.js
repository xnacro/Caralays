const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
dotEnv.config();

app.get("/", (req, res) => {
    res.send("Hello World");
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

port = process.env.PORT;
server.listen(port, () => {
   console.log(`HTTP + WebSocket server running on port ${port}`);
});