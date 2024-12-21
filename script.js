Promise.all([
    fetch("http://localhost:8000/metadata.json"),
    fetch("http://localhost:8000/data.json"),
]).then(([metadata, data]) => {
    return Promise.resolve([metadata.json(), data.json()]);
}).then(([metadata, data]) => {
    debugger;
    populateSelectOptions(metadata, data);
});

// TODO: Parse from metadata csv.
const INPUT_COLUMNS = [0,1,2]

function populateSelectOptions(metadata, data) {
    let inputs = {};
    for (let i = 0; i < INPUT_COLUMNS.length; i++) {
        let key = data[0][INPUT_COLUMNS[i]];
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
}
