# Code experts - Unaprijeđenje BH akademskog imenika

Ekipa Code experts predstavlja naše rješenje poboljšanja web aplikacije BH akademski imenik

## Funkcionalnosti

### Sumiranje Naučnih Radova

Implementirali smo inovativnu funkcionalnost koja omogućava automatsko sumiranje naučnih radova na osnovu PDF fajlova. Ove sumacije izvlače osnovne informacije poput autora, email adrese, afilijacija, projekata, čime se olakšava preglednost i štedi vrijeme istraživača.

### Napredna Pretraga

Naša napredna pretraga nije ograničena samo na ključne riječi. Omogućavamo korisnicima da unesu tekst na osnovu kojeg će dobiti bolje rezultate pretrage. Ova funkcionalnost posebno je korisna za situacije gdje standardna pretraga nije dovoljna. Uradili smo detaljnu validaciju kako bismo osigurali da naša aplikacija može nositi s raznim edge caseovima. Bez obzira na ulazne podatke ili scenarije, naša aplikacija je dizajnirana da pruži precizne i pouzdane rezultate.


## Tehnički Detalji

- **Backend:** Node.js, Express.js
- **Sumiranje PDF-a:** Implementirali smo korisnički interfejs (UI) za sumiranje PDF fajlova.
- **Napredna Pretraga:** Dodane su specifične rute za ovu funkcionalnost.
- **Validacija:** Odrađena je temeljna validacija za razne edge caseove.
- **Unit Testovi:** Napisani su unit testovi koristeći Jest i Supertest frameworks kako bismo osigurali stabilnost i tačnost.
- **API:** MistralAI, OpenAI API, Semantic Scholar API
