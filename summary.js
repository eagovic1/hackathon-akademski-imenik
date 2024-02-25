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

    return "Error while reading PDF. It doesn't exist on the server or it's corrupted.";
  }
};




async function getAnswer(question, type = "", lang = "") {

  let prompt = ` "[INST]Give me a summary with ${type} terms of maximum 5 sentences of this text in ${lang.toUpperCase()}. Don't write anything else: ${question}[/INST]" `

  await axios.post("https://fine-turtles-smoke.loca.lt/v1/completions", {
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    prompt: prompt,
    max_tokens: 1000,
    temperature: 0.5,
  }).then
    (async function (response) {

      const answer = await response.data.choices[0].text;
      console.log(answer);
      return answer;
    }).catch(function (error) {
      console.log("Greska", error);
    });






  // const stream = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",

  //   messages: [
  //     {
  //       role: "user",
  //       content: prompt,

  //     },
  //   ],
  //   temperature: 0.25,
  // });
  //console.log(stream.choices[0]);

  //return stream.choices[0].message.content;
  return;
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
      `https://api.semanticscholar.org/graph/v1/paper/${req.params.id}?openAccessPdf=true&fields=openAccessPdf,abstract`
    )
    .then(async function (response) {
      const url = response.data.openAccessPdf.url;
      //console.log(response.data.openAccessPdf.url);
      //  console.log(response);

      const read = await readPDF(response.data.openAccessPdf.url);

      if (read == "Error while reading PDF. It doesn't exist on the server or it's corrupted.") {

        res.send("Greska u citanju PDF-a, ne postoji ili je pokvaren ovo je abstract ovog naučnog rada: \n" + response.data.abstract);
      }
      else {

       // const answer = await getAnswer(read, req.params.type, req.params.lang);



        let prompt = ` "[INST]Give me a summary with ${req.params.type} terms of maximum 5 sentences of this text in ${req.params.lang.toUpperCase()}. Don't write anything else: ${read}[/INST]" `

        await axios.post("https://fine-turtles-smoke.loca.lt/v1/completions", {
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.5,
        }).then
          (async function (response) {

            const answer = await response.data.choices[0].text;
            console.log(answer);
            res.send(answer);
          }).catch(function (error) {
            console.log("Greska", error);
          });

      }
    })
    .catch(function (error) {
      console.log("er", error);
    })

});

app.listen(3000, () => {
  console.log("Started");
});
