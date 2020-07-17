const express = require('express');
const router = express.Router();

/**@description - Task almacenará el esquema de datos*/
const Task = require('../models/task');

/**@description - Principal Route */
router.get('/', async(req, res) => {
    const tasks = await Task.find();
    res.render('index', {
        tasks
    });
});

/**@description - Form route */
router.post('/add', async (req, res) => {
    //console.log(new Task(req.body));//to check if I receive the data
    const task = new Task(req.body);
    await task.save();
    //res.send('Received ok') //esto se usó com paso previo, ya no es necesario.
    res.redirect('/');
});

module.exports = router;