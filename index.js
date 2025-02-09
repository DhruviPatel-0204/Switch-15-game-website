const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
function clearUploadsDirectory() {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads directory:", err);
      return;
    }

    files.forEach((file) => {
      if (file !== "th.jpeg") {
        const filePath = path.join(uploadsDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", filePath, err);
          }
        });
      }
    });
  });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    clearUploadsDirectory(); 
    cb(null, uploadsDir); 
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const defaultImageUrl = "/uploads/th.jpeg"; 
  res.render("index", { imageUrl: defaultImageUrl });
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    const uploadedImageUrl = `/uploads/${req.file.filename}`;
    res.render("index", { imageUrl: uploadedImageUrl }); 
  } else {
    const defaultImageUrl = "/uploads/th.jpeg";
    res.render("index", { imageUrl: defaultImageUrl }); 
  }
});


app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }

    res.sendFile(filePath);
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
