const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.log('🔍 [1] Server starting...');

//-------------------Config----------------//
dotenv.config({ path: './config.env' });

console.log('🔍 [2] Config loaded');
console.log('🔍 DATABASE URL:', process.env.DATABASE ? '✅ Set' : '❌ Missing');
console.log('🔍 PORT:', process.env.PORT || 3000);

//----------Exception Handling-------------//
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

console.log('🔍 [3] Exception handler set');

//--------------------APP-------------------//
console.log('🔍 [4] Loading app...');
const app = require('./app');
console.log('🔍 [5] App loaded successfully');

//--------------------DB-------------------//
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

console.log('🔍 [6] Connecting to MongoDB...');

mongoose
    .connect(DB)
    .then(() => {
        console.log('✅ DB connection successful!');
    })
    .catch(err => {
        console.log('❌ DB connection error:', err.message);
        process.exit(1);
    });

console.log('🔍 [7] MongoDB connection initiated');

//------------------Listener----------------//
const port = process.env.PORT || 3000;

console.log('🔍 [8] Starting server on port', port);

const server = app.listen(port, () => {
    console.log(`🚀 App running on port ${port}...`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

console.log('🔍 [9] Server object created');

//--------------Rejection Handler------------//
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

console.log('🔍 [10] Rejection handler set');

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

console.log('🔍 [11] All handlers set - Server ready!');