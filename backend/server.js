import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 todAI backend server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
  });
});
