const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8080;

// Connect Database
connectDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));