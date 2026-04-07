require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const Booking = require("./models/Booking");
const Admin = require("./models/Admin");
const { protect } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB().then(async () => {
  // Auto-seed admin user since we are using memory server
  const adminExists = await Admin.findOne({ username: "admin" });
  if (!adminExists) {
    const admin = new Admin({ username: "admin", password: "adminpassword" });
    await admin.save();
    console.log("Seeded default admin (admin / adminpassword)");
  }
});

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    cb(null, `${timestamp}-${randomString}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

app.use(cors());
app.use(express.json());
// Serve static files from uploads directory (required for admin to download files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Public Routes ---

// POST endpoint to handle bookings
app.post("/book", upload.single("file"), async (req, res, next) => {
  try {
    const { name, rollNumber, ldapId, date, time, reason, sport } = req.body;

    // Validate required fields
    if (!name || !rollNumber || !ldapId || !date || !time || !reason || !sport) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create booking object
    const bookingData = {
      name,
      rollNumber,
      ldapId,
      date,
      time,
      reason,
      sport,
      file: req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          }
        : null,
    };

    // Save to MongoDB
    const booking = await Booking.create(bookingData);

    console.log("New Booking saved to DB:", booking._id);
    res.status(200).json({ 
      message: "Booking confirmed successfully!",
      bookingId: booking._id 
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    next(error);
  }
});

// Admin Login Route
app.post("/api/admin/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    next(error);
  }
});

// --- Protected Admin Routes ---

// GET all bookings
app.get("/api/bookings", protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// GET specific booking
app.get("/api/bookings/:id", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

// PATCH to update booking status
app.patch("/api/bookings/:id", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Ensure status is valid
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
