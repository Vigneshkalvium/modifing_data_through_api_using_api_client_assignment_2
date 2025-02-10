const mongoose = require('mongoose');

const connectDatabase = ()=>{
    try {
        mongoose
        .connect(process.env.DB_URL)
        .then((data)=>{
            console.log(`Database connected to the server: ${data.connection.host}`);
        })
    } catch (error) {
        console.log(`Database connection failed: ${error.message}`);
    }
}

module.exports = connectDatabase;