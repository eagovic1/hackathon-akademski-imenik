function search() {
  console.log("searching...");
  let lang = document.getElementById("lang-dropdown").value;
  let type = document.getElementById("type-dropdown").value;
  let id = document.getElementById("paper-id").value;

  fetch(`/summary/${id}/${type}/${lang}`)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("summary-content").innerText = data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
