var data;

fetch("http://localhost:8000/data.json")
    .then(response => response.json())
    .then(fetched => {
        data = fetched;
        populateSelectOptions();
    })
    .catch(error => console.error("Error:", error));

function populateSelectOptions() {
    for (let i = 0; i < data[0].length; i++) {
        console.log(`Adding options for ${data[0][i]}`)
        for (let j = 1; j < data.length; j++) {
            console.log(data[j][i]);
        }
    }
}
