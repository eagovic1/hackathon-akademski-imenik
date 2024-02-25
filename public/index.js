async function search() {
  console.log("searching...");
  let lang = document.getElementById("lang-dropdown").value;
  let type = document.getElementById("type-dropdown").value;
  let id = document.getElementById("paper-id").value;

  invalid = false

  await fetch(`/summary/${id}/${type}/${lang}`)
    .then((response) => response.text())
    .then((data) => {
     
      if (data=="error") {
        window.alert("INVALID ID")
        invalid = true
        return;
      }
      let formattedData = "<p>";
      formattedData += `<strong>Summary: </strong> ${data} </p>`;
      document.getElementById("summary-content").innerHTML = formattedData;
    })
    .catch(function (error) {
      console.log(error);
    });

  if (invalid) return

  await fetch(`/info/${id}`)
    .then((response) => response.text())
    .then((data) => {
      let formattedData = "<ul>";
      for (const key in JSON.parse(data)) {
        let affiliations = [];
        if (JSON.parse(data).hasOwnProperty(key)) {
          let value = JSON.parse(data)[key];
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
              for (let i = 0; i < value.length; i++) {
                const clan = value[i];
                for (const key1 in clan) {
                  affiliations.push(clan[key1]);
                }
              }
              formattedData += `<li><strong>${key}:</strong> ${affiliations.join(", ")}</li>`;
            }
            value = value.join(", ");
          }
          if (value && affiliations.length == 0) {
            formattedData += `<li><strong>${key}:</strong> ${value}</li>`;
          }
        }
      }
      formattedData += "</ul>";
      document.getElementById("info-content").innerHTML = formattedData;
    })
    .catch(function (error) {
      console.log(error);
    });

  document.getElementById("result-container").style.display = "block";
  document.querySelector("form").style.display = "none";
}
