const mongoose = require("mongoose")

const RecordSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    relationship: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Must provide an email"],
    },
    password: {
        type: String,
        required: true,
    },
})

const Record = mongoose.model.records || mongoose.model("records", RecordSchema)

module.exports = Record;