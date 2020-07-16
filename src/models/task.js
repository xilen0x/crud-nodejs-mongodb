/**
 * Esquema de base de datos
 */
const mongoose = require('mongoose');
mongoose.Schema; 

const TaskSchema = new Schema({
    title: String,
    description: String,
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('tasks', TaskSchema);