const express = require('express');
const router = express.Router();

/**@description - Task almacenará el esquema de datos*/
const Task = require('../models/task');

/**@description - Principal Route */
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', {
        tasks
    });
});

/**@description - Form route - add */
router.post('/add', async (req, res) => {
    //console.log(new Task(req.body));//to check if I receive the data
    const task = new Task(req.body);
    await task.save();
    //res.send('Received ok') //esto se usó com paso previo, ya no es necesario.
    res.redirect('/');
});

/**@description - Task already done */
router.get('/switch/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.status = !task.status;
    await task.save();
    res.redirect('/');
});

/**@description - Edit Task */
 router.get('/edit/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('edit', { task });
    
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    await Task.update({_id: id}, req.body);
    res.redirect('/');
}); 

/**@description - Delete task */
router.get('/delete/:id', async (req, res) => {
    let { id } = req.params;
    await Task.remove({ _id: id });
    res.redirect('/');
});

module.exports = router;