let search = document.querySelector(".searchBox");
let convert = document.querySelector(".convert");
let fromCurrency = document.querySelector(".from");
let toCurrency = document.querySelector(".to");
let finalValue = document.querySelector(".finalValue");
let finalAmount = document.getElementById("finalAmount");
let resultFrom = fromCurrency.value;
let resultTo = toCurrency.value;
let searchValue;

fromCurrency.addEventListener('change', (event) => {
  resultFrom = event.target.value;
});

toCurrency.addEventListener('change', (event) => {
  resultTo = event.target.value;
});

search.addEventListener('input', updateValue);

function updateValue(e) {
  searchValue = e.target.value;
}

convert.addEventListener("click", getResults);

function getResults() {
  fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => response.json())
    .then(data => {
        let fromRate = data.find(currency => currency.cc == resultFrom).rate;
        let toRate = data.find(currency => currency.cc == resultTo).rate;
        let uahRate = 1; 
        displayResults(fromRate, toRate, uahRate);
    })
    .catch(error => {
        console.error('Error!!', error);
    });
}

function displayResults(fromRate, toRate, uahRate) {
  let amountInUah = searchValue * fromRate; 
  let convertedAmount = (amountInUah / toRate).toFixed(2); 
  finalValue.innerHTML = convertedAmount;
  finalAmount.style.display = "block";
}

function clearVal() {
  document.querySelector(".finalValue").innerHTML = "";
  finalAmount.style.display = "none";
}

convert.addEventListener("click", clearVal);