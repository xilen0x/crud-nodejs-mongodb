/**
 * Simple aplicación CRUD con express y mongodb.
 * jsdoc para la documentación.
 */
/**author Fazt - Adaptación y mejoras : Carlos Astorga */

/**description - Importación de express e instanciarlo (y otros)*/
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

/**connection to db */
mongoose.connect('mongodb://localhost/crud-mongo')
    .then(db => console.log('DB connected ok!'))
    .catch(err => console.log(err));

/**importing routes from index.js file*/
const indexRoutes = require('./routes/index');

/**Settings -  Levantar nuestro server en el puerto definido por el host o en su defecto usar el 3000 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));// con ayuda del modulo path, le indicamos al SO la ruta de nuestras views.
app.set('view engine', 'ejs');// motor de plantillas ejs

/**middlewares */
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//modulo q me permite entender y guardar datos enviados por el formulario html

/**my routes */
app.use('/', indexRoutes);

/**starting the server */
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
