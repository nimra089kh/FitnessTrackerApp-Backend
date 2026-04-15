const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then( () => {
    console.log("Db connected");
})
.catch((err) => {
    console.log("Db not connected", err)
})