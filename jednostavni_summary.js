const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const OpenAI = require("openai");
const request = require('request');
const pdf = require('pdf-parse');
const pdfUrl = 'your-pdf-url';
const openai = new OpenAI({
    apiKey: "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"
});
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
  
  // Function to read PDF content
  const readPDF = async (url) => {
    try {
      const pdfBuffer = await downloadPDF(url);
      const data = await pdf(pdfBuffer);
      
      // Access text content of the PDF
      return data.text;
    } catch (error) {
      console.error('Error:', error);
    }
  };

    async function getAnswer(question) {
            const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Write me 10 sentence simple summary adapted for the general public of this research paper: ${question}` }],
        });
        console.log(stream.choices[0])
        return stream.choices[0].message.content;
    }

app.get('/summary/:id', function(req, res){
    axios.get(`https://api.semanticscholar.org/graph/v1/paper/${req.params.id}?openAccessPdf=true&fields=openAccessPdf`)
    .then(async function(response) {
        const url = response.data.openAccessPdf.url;
        console.log(response.data.openAccessPdf.url);
        const read = await readPDF(response.data.openAccessPdf.url);
        const answer = await getAnswer(read);
        res.send(answer);
    }).catch(function (error) {
    // handle error
    console.log(error);
    })
    .finally(function () {
      // always executed
    });
})

app.listen(3000, ()=>{console.log("Started")});