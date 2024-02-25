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

