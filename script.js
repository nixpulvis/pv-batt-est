var data;

fetch("http://localhost:8000/data.json")
    .then(response => response.json())
    .then(fetched => {
        data = fetched;
        populateSelectOptions();
    })
    .catch(error => console.error("Error:", error));

// TODO
const INPUT_COLUMNS = [0,1,2]

function populateSelectOptions() {
    for (let i = 0; i < data[0].length; i++) {
        console.log(`Adding options for ${data[0][i]}`)
        // TODO: styling
        var label = $("<label>").prop("for", data[0][i]).text("  " + data[0][i]);
        var select = $("<select>").prop("id", data[0][i]);

        // TODO: filter duplicates
        for (let j = 1; j < data.length; j++) {
            console.log(data[j][i]);
            var option = $("<option>").val(data[j][i]).text(data[j][i]);
            select.append(option);
        }

        $("#input")
            .append(select)
            .append(label)
            .append("<br>");
    }
}
