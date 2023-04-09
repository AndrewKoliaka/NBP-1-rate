let date;
let rate;
const API_PATH = 'https://api.nbp.pl/api/exchangerates/rates/a/usd/';

const getRateButton = document.getElementById('get-rate-button');
const dateInput = document.getElementById('date-input');
const rateCell = document.getElementById('rate');
const rateDateCell = document.getElementById('rate-date');
const paramsDate = location.pathname.slice(1);

if (paramsDate) {
    date = paramsDate;
    dateInput.value = paramsDate;
    fetchRate();
}

async function fetchRate() {
    let currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);

    while (!rate) {
        try {
            const formattedDate = currentDate.toISOString().split('T')[0]
            const response = await fetch(`${API_PATH}${formattedDate}`);

            if (response.status === 404) {
                currentDate.setDate(currentDate.getDate() - 1);
                continue;
            }

            if (response.status !== 200) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            rateCell.innerText = data.rates[0].mid;
            rateDateCell.innerText = formattedDate;
            rate = data.rates[0].mid;

            break;
        } catch (e) {
            alert(e.message)
            break;
        }
    }
}

function onDateChange(event) {
    date = event.target.value;
}

function onGetRateClick() {
    rate = 0;
    fetchRate();
}

getRateButton.addEventListener('click', onGetRateClick);
dateInput.addEventListener('change', onDateChange);
