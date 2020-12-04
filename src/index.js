const express = require('express');
const bodyParer = require('body-parser')
const cors = require('cors')
const app = express();

const corsOptions = {
    origin: '*'
}

//setting
app.set('port', process.env.PORT || 7000);
app.set('json spaces', 2);

//Middleware
app.use(bodyParer.urlencoded({extended: false}));
app.use(bodyParer.json());

//Routes
app.use("/api", cors(corsOptions),require('./routes/index'))

//Starting the server...
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})