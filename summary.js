const express = require("express");
const app = express();
const axios = require("axios");
const OpenAI = require("openai");
const request = require("request");
const pdf = require("pdf-parse");
const openai = new OpenAI({
  apiKey: "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",
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

const readPDF = async (url) => {
  try {
    const pdfBuffer = await downloadPDF(url);
    const data = await pdf(pdfBuffer);

    return data.text;
  } catch (error) {
    console.error("Error:", error);
  }
};

async function getAnswer(question, type, lang) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Write me 5 to 10 sentences summary of this research paper in ${lang} language and (IMPORTANT) ${type} terminology and (FOLLOW TYPE OF TERMINOLOGY STRICTLY): ${question}`,
      },
    ],
  });
  console.log(stream.choices[0]);
  return stream.choices[0].message.content;
}

app.get("/summary/:id/:type/:lang", function (req, res) {
  if (
    !["medical", "scientific", "technical", "simplified", "general"].includes(
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
      console.log(response.data.openAccessPdf.url);
      const read = await readPDF(response.data.openAccessPdf.url);
      const answer = await getAnswer(read, req.params.type, req.params.lang);
      res.send(answer);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
});

app.listen(3000, () => {
  console.log("Started");
});
