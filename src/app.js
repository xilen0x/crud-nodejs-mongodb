/**
 * Simple aplicación CRUD con express y mongodb.
 * jsdoc para la documentación.
 **/

/**description - Importación de express e instanciarlo (y otros)*/
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
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
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Bootstrap is served from the CDN; inline styles are used in the views.
            styleSrc: ["'self'", 'https://stackpath.bootstrapcdn.com', "'unsafe-inline'"],
            scriptSrc: ["'self'"]
        }
    }
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//modulo q me permite entender y guardar datos enviados por el formulario html

/**my routes */
app.use('/', indexRoutes);

/**centralized error handler - avoids leaking stack traces and keeps the process alive */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

/**starting the server */
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
