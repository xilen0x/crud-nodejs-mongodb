const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**@description - Task almacenará el esquema de datos*/
const Task = require('../models/task');

/**
 * @description - Whitelist only the fields the user is allowed to set.
 * Prevents mass assignment (e.g. forcing `status`) and NoSQL operator injection.
 */
function pickTaskFields(body) {
    return {
        title: typeof body.title === 'string' ? body.title : '',
        description: typeof body.description === 'string' ? body.description : ''
    };
}

/**@description - Reject requests whose :id is not a valid ObjectId before hitting the DB. */
function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

/**@description - Wrap async handlers so rejections go to the error middleware instead of crashing. */
function wrap(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

/**@description - Principal Route */
router.get('/', wrap(async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks });
}));

/**@description - Form route - add */
router.post('/add', wrap(async (req, res) => {
    const task = new Task(pickTaskFields(req.body));
    await task.save();
    res.redirect('/');
}));

/**@description - Task already done (state change -> POST) */
router.post('/switch/:id', wrap(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send('Invalid id');
    const task = await Task.findById(id);
    if (!task) return res.status(404).send('Task not found');
    task.status = !task.status;
    await task.save();
    res.redirect('/');
}));

/**@description - Edit Task */
router.get('/edit/:id', wrap(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send('Invalid id');
    const task = await Task.findById(id);
    if (!task) return res.status(404).send('Task not found');
    res.render('edit', { task });
}));

/**@description - Update Task (state change -> POST) */
router.post('/update/:id', wrap(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send('Invalid id');
    await Task.updateOne({ _id: id }, pickTaskFields(req.body));
    res.redirect('/');
}));

/**@description - Delete task (state change -> POST) */
router.post('/delete/:id', wrap(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).send('Invalid id');
    await Task.deleteOne({ _id: id });
    res.redirect('/');
}));

module.exports = router;
