const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

document.querySelector('.current-date').innerText = `${day}.${month}.${year}`;

const table = document.querySelector(".table");

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => {
        return response.json()
    })
    .then(data => {
        data.forEach(item => {
            const row = document.createElement("tr"); 
            row.className="row"
            row.innerHTML = `<td>${item.txt}</td>
                        <td>${item.rate}</td>
                        <td>${item.cc}</td>`
            table.appendChild(row);
        }
    );
})
