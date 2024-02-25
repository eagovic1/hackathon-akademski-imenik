const express = require("express");
const app = express();
const axios = require("axios");
const OpenAI = require("openai");
const request = require("request");
const path = require("path");
const pdf = require("pdf-parse");
const { constrainedMemory } = require("process");
const openai = new OpenAI({
  apiKey: "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",
});
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
    console.error("Error:", error);
  }
};

async function getAnswer(question, type ="", lang ="" ) {
  let prompt = "";
  if(type==null || type == "" || type == ":type"){
    prompt = `Write me 5 to 10 sentences summary of this research paper in english language and (IMPORTANT) general terminology and (FOLLOW TYPE OF TERMINOLOGY STRICTLY): ${question}`
  }
  else prompt = `Write me 5 to 10 sentences summary of this research paper in ${lang} language and (IMPORTANT) ${type} terminology and (FOLLOW TYPE OF TERMINOLOGY STRICTLY): ${question}`
  console.log(prompt);
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
  console.log(stream.choices[0]);
  return stream.choices[0].message.content;
}

app.get("/summary/:id/:type/:lang", function (req, res) {
  console.time("test_timer");
  if (
    !["medical", "scientific", "technical", "simplified", "general", ":type", ""].includes(
      req.params.type.toString()
    ) ||
    !["english", "german", "bosnian", ":lang", ""].includes(req.params.lang.toString())
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
      console.timeEnd("test_timer");
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
});

app.listen(3000, () => {
  console.log("Started");
});
