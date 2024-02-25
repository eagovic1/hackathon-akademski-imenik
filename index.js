const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const OpenAI = require("openai");
const request = require('request');
const path = require('path');
const pdf = require('pdf-parse');
const pdfUrl = 'your-pdf-url';
const openai = new OpenAI({
    apiKey: "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"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const downloadPDF = (url) => {
    return new Promise((resolve, reject) => {
        request({ uri: url, encoding: null }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};

const readPDF = async (url) => {
    try {
        const pdfBuffer = await downloadPDF(url);
        const data = await pdf(pdfBuffer);

        return data.text;
    } catch (error) {
        console.error('Error:', error);
    }
};

async function getExtractInfo(text) {
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `(Strictly JSON, NO EXTRA TEXT) Extract the following information from the text in JSON (affiliations return like ARRAY OF STRINGS):\nTitle:\nVenue:\nAuthors:\nEmails:\nAffiliations:\nProjects:\n${text}` }],
    });
    console.log(stream.choices[0])
    return stream.choices[0].message.content;
}


async function getAnswer(question, type, lang) {
    let prompt = "";
    prompt = `Write me 5 to 10 sentences summary of this research paper in ${lang} language and (IMPORTANT) ${type} terminology and (FOLLOW TYPE OF TERMINOLOGY STRICTLY): ${question}`

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",

        messages: [
            {
                role: "user",
                content: prompt,

            },
        ],
        temperature: 0.25,
    });
    return stream.choices[0].message.content;
}

app.get("/summary/:id/:type/:lang", function (req, res) {
    console.time("test_timer");
    if (
        !["scientific", "simplified"].includes(
            req.params.type.toString()
        ) ||
        !["english", "german", "bosnian"].includes(req.params.lang.toString())
    ) {
        res.send("Invalid type or language");
        return;
    }
    axios
        .get(
            `https://api.semanticscholar.org/graph/v1/paper/${req.params.id}?openAccessPdf=true&fields=openAccessPdf`
        )
        .then(async function (response) {
            const url = response.data.openAccessPdf.url;
            console.log(response);

            const read = await readPDF(response.data.openAccessPdf.url);
            const answer = await getAnswer(read, req.params.type, req.params.lang);
            res.send(answer);
            console.timeEnd("test_timer");
        })
        .catch(function (error) {
            console.log("er", error);
        })
});

app.get("/summary/:id", function (req, res) {
    console.time("test_timer");
    axios
        .get(
            `https://api.semanticscholar.org/graph/v1/paper/${req.params.id}?openAccessPdf=true&fields=openAccessPdf`
        )
        .then(async function (response) {
            const url = response.data.openAccessPdf.url;
            console.log(response);

            const read = await readPDF(response.data.openAccessPdf.url);
            const answer = await getAnswer(read, "general", "english");
            res.send(answer);
            console.timeEnd("test_timer");
        })
        .catch(function (error) {
            console.log("er", error);
        })
});

app.get('/info/:id', function (req, res) {
    axios.get(`https://api.semanticscholar.org/graph/v1/paper/${req.params.id}?openAccessPdf=true&fields=openAccessPdf`)
        .then(async function (response) {
            const url = response.data.openAccessPdf.url;
            console.log(response.data.openAccessPdf.url);
            const read = await readPDF(response.data.openAccessPdf.url);
            const answer = await getExtractInfo(read);
            res.send(answer);
        }).catch(function (error) {
            console.log(error);
        })
})

app.listen(3000, () => {
    console.log("Started");
});

