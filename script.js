Promise.all([
    fetch("http://localhost:8000/metadata.json"),
    fetch("http://localhost:8000/data.json"),
]).then(([metadata, data]) => {
    return Promise.all([metadata.json(), data.json()]);
}).then(([metadata, data]) => {
    populateSelectOptions(metadata, data);
});

// TODO: Parse from metadata csv.
function populateSelectOptions(metadata, data) {
    let [inputs, outputs] = parseMetadata(metadata, data);

    let inputs_elements = {};
    for (let i = 0; i < inputs.length; i++) {
        let key = inputs[i].key;
        var label = $("<label>").prop("for", key).text(inputs[i].label);
        var select = $("<select>").prop("id", key);

        for (let j = 0; j < data.length; j++) {
            if (j == 0) {
                inputs_elements[key] = [];
            } else {
                var element = data[j][inputs[i].dataColumn];
                if (inputs_elements[key].indexOf(element) === -1) {
                    inputs_elements[key].push(element);
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

function parseMetadata(metadata, data) {
    let header = data[0];
    let inputs = [];
    let outputs = [];
    for (let i = 0; i < metadata.length; i++) {
        if (metadata[i][3] == "Input") {
            inputs.push(parseMetadataRow(metadata[i], header));
        } else if (metadata[i][3] == "Output") {
            outputs.push(parseMetadataRow(metadata[i], header));
        }
    }

    return [inputs, outputs];
}

function parseMetadataRow(metadata, header) {
    return {
        'label': metadata[0],
        'key': metadata[1],
        'dataColumn': header.indexOf(metadata[1]),
        'unit': metadata[2],
    }
}
