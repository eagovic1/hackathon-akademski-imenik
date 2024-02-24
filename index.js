const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({apiKey : "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"} )

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

async function getAnswer(question) {    
    const completion = await openai.chat.completions.create({
        messages: [{"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}],
        model: "gpt-3.5-turbo",
      });
    
      console.log(completion.choices[0]);
}

getAnswer("Who won the world series in 2020?")

app.listen(3000);

