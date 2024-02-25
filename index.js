const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const OpenAI = require('openai');
const path = require('path');

const openai = new OpenAI({apiKey : "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"} )

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000);

