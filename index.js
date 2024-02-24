const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));




app.listen(3000);

