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
    let inputs = {};
    for (let i = 0; i < INPUT_COLUMNS.length; i++) {
        let key = data[0][INPUT_COLUMNS[i]];
        console.log(`Adding options for ${key}`)
        // TODO: styling
        var label = $("<label>").prop("for", data[0][i]).text("  " + data[0][i]);
        var select = $("<select>").prop("id", data[0][i]);

        for (let j = 0; j < data.length; j++) {
            if (j == 0) {
                inputs[key] = [];
            } else {
                var element = data[j][INPUT_COLUMNS[i]];
                if (inputs[key].indexOf(element) === -1) {
                    inputs[key].push(element);
                    var option = $("<option>").val(element).text(element);
                    select.append(option);
                }
            }
        }

        $("#input")
            .append(label)
            .append(select)
            .append("<br>");
    }

    // for (let i = 0; i < data[0].length; i++) {

    //     // TODO: filter duplicates
    //     for (let j = 1; j < data.length; j++) {
    //         console.log(data[j][i]);
    //         var option = $("<option>").val(data[j][i]).text(data[j][i]);
    //         select.append(option);
    //     }

    //     $("#input")
    //         .append(select)
    //         .append(label)
    //         .append("<br>");
    // }
}
