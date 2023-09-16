import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Test express and typescript");
});

app.listen(PORT, () => {
  console.log(`Server test running, http://localhost:${PORT}`);
});
