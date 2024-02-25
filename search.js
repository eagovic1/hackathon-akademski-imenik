const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const OpenAI = require("openai");
const axios = require("axios");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const openai = new OpenAI({
    apiKey: "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"
});


app.get('/search', (req, res) => {
    const prompt = req.query.prompt;
    if (prompt.trim().length <= 2) {
        res.json({ error: "Search filter must not be 2 characters or shorter!" });
    }
    else if (!isNaN(parseInt(prompt))) {
        res.json({ error: "Search filter must not be a number!" });
    }
    else {
        const url = "https://fine-turtles-smoke.loca.lt/v1/completions";
        const body = {
            "model": "mistralai/Mistral-7B-Instruct-v0.2",
            "prompt": `[INST] Make a response only of JSON array of 1 to 3 scientific keywords with key keywords or error message with key error from the given paragraph. Dont put anything else in response besides the array, no text before or after the JSON array. Response should only have the keywords or error array. Response should never have both keywords and error arrays. Dont suggest your interaction only give keywords or error based on my paragraph sent after the instruction. Also, there should be validation about my paragraph. If it doesnt make sense or if its a random sequence of characters which isnt a word you should return \"error\" : \"Invalid search input\". Format should always be with keywords key value of array or error key value of array. I will give you two examples of interaction. Here is an example of the valid interaction. How computers work low level? \"keywords\" : [Microprocessor, Transistor, Logic design]'. Here is an example of the invalid interaction: UASHDUDHFUHDSU? \"error\": 'Invalid search input'. Here is the prompt ${prompt} [/INST]`,
            "stop": "?",
            "temperature": 0,
            "max_tokens": 1000
        }
        axios.post(url, body).then(response => {
            const text = response.data.choices[0].text;
            console.log(text);
            console.log("Done");
            if (text.includes('error":')) {
                res.json({ error: "Invalid search input! Please enter a valid search input." })
            }
            else {
                try {
                    const keywords = JSON.parse("{" + response.data.choices[0].text + "}").keywords;
                    const query = keywords.join('+');
                    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}`;
                    axios.get(url)
                        .then(response => {
                            console.log("data" + response.data);
                            res.send(response.data.data);
                        });
                }
                catch (e) {
                    if (text.includes('keywords" :')) {
                        const startIndex = text.indexOf('"keywords"');
                        const endIndex = text.indexOf(']', startIndex);
                        console.log(text.substring(startIndex, endIndex + 1));
                        const query = JSON.parse("{" + text.substring(startIndex, endIndex + 1) + "}").keywords;
                        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}`;

                        axios.get(url)
                            .then(response => {
                                console.log("data" + response.data);
                                res.send(response.data.data);
                            });
                    }
                    else {
                        res.json({ error: "Invalid search input! Please enter a valid search input." })
                    }
                }
            }
        })
    }
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});