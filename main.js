// Country Data
async function populateCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        const select = document.getElementById('countrySelect');

        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2.toLowerCase();
            option.textContent = `${country.flag} ${country.name.common}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

// Swap Fields
function swapFields() {
    let input1 = document.getElementById("input1");
    let input2 = document.getElementById("input2");
    
    if (!input1 || !input2) {
        console.error("One or both input elements not found!");
        return;
    }
    
    let temp = input1.value;
    input1.value = input2.value;
    input2.value = temp;
}

// Airport Data
let airportsData = [];

async function loadAirports() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat');
        const text = await response.text();
        
        airportsData = text.split('\n').map(line => {
            const fields = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
            return {
                name: fields[1] ? fields[1].replace(/"/g, '') : '',
                city: fields[2] ? fields[2].replace(/"/g, '') : '',
                country: fields[3] ? fields[3].replace(/"/g, '') : '',
                iata: fields[4] ? fields[4].replace(/"/g, '') : ''
            };
        }).filter(airport => airport.name && airport.iata !== '\\N');
    } catch (error) {
        console.error('Error fetching airport data:', error);
    }
}

function populateDropdown(dropdownId, airports) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
    airports.slice(0, 50).forEach(airport => {
        const option = document.createElement('option');
        option.value = `${airport.name} (${airport.iata})`;
        option.textContent = `${airport.name} (${airport.iata}) - ${airport.city}, ${airport.country}`;
        dropdown.appendChild(option);
    });
    dropdown.style.display = airports.length > 0 ? 'block' : 'none';
}

function searchAirports(inputId, dropdownId) {
    const query = document.getElementById(inputId).value.toLowerCase();
    const dropdown = document.getElementById(dropdownId);

    if (query.length < 2) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
    }

    const filteredAirports = airportsData.filter(airport => 
        airport.name.toLowerCase().includes(query) || 
        airport.city.toLowerCase().includes(query)
    );

    if (filteredAirports.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    populateDropdown(dropdownId, filteredAirports);
}

function selectAirport(inputId, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const selectedValue = dropdown.value;
    document.getElementById(inputId).value = selectedValue;
    dropdown.style.display = 'none';
}

// Combined onload handler
window.onload = async function() {
    await loadAirports();      // Load airport data
    await populateCountries(); // Load country data
};