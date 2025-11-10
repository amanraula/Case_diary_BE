const fs = require("fs");
const path = require("path");  // ✅ THIS IS THE FIX

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const errorHandler = require('./middleware/error.middleware');


const app = express();
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
const uploadsRoot = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });

// serve uploaded files
app.use('/uploads', express.static(uploadsRoot));
// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use("/api/2fa", require("./routes/2fa.routes"));
app.use('/api/schedules', require('./routes/schedule.routes'));

// simple health endpoint
app.get('/', (req, res) => res.send('Digital Crime Diary API running'));

// error handler should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
