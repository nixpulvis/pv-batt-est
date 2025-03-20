Promise.all([
    // NOTE: For production.
    fetch("https://cleanpowereverywhere.com/metadata.json"),
    fetch("https://cleanpowereverywhere.com/data.json"),

    // NOTE: For local development only.
    // fetch("http://localhost:8000/metadata.json"),
    // fetch("http://localhost:8000/data.json"),
]).then(([metadata, data]) => {
    return Promise.all([metadata.json(), data.json()]);
}).then(([metadata, data]) => {
    populateSelectOptions(metadata, data);
    populateResults(metadata, data);
});

function parseMetadata(metadata, data, type) {
    let header = data[0];
    let inputs = [];
    for (let i = 0; i < metadata.length; i++) {
        if (metadata[i][3] == type) {
            inputs.push(parseMetadataRow(metadata[i], header));
        }
    }

    return inputs;
}

function parseMetadataRow(metadata, header) {
    return {
        'label': metadata[0],
        'key': metadata[1],
        'id': metadata[1].replace(/\W/g, ''),
        'dataColumn': header.indexOf(metadata[1]),
        'unit': metadata[2],
        'default': metadata[4],
    }
}

function populateSelectOptions(metadata, data) {
    let inputs = parseMetadata(metadata, data, "Input");

    let inputs_elements = {};
    for (let i = 0; i < inputs.length; i++) {
        let id = inputs[i].id;
        var label = $("<label>").prop("for", id).text(inputs[i].label);
        var select = $("<select>").prop("id", id);
        var unit = $("<label>").prop("for", id).text(inputs[i].unit);

        for (let j = 0; j < data.length; j++) {
            if (j == 0) {
                inputs_elements[id] = [];
            } else {
                var element = data[j][inputs[i].dataColumn];
                if (inputs_elements[id].indexOf(element) === -1) {
                    inputs_elements[id].push(element);
                    var option = $("<option>").val(element).text(element);
                    if (inputs[i].default == element) {
                      option.prop("selected", "selected");
                    }
                    select.append(option);
                }
            }
        }

        $("#input")
            .append(label)
            .append(select)
            .append(unit)
            .append("<br>");

        sortSelectOptions(id);
    }
}

function sortSelectOptions(selectId) {
    const selectElement = document.getElementById(selectId);
    const options = Array.from(selectElement.options);

    options.sort((a, b) => {
        const valueA = parseInt(a.value);
        const valueB = parseInt(b.value);
        return valueA - valueB;
    });

    options.forEach(option => selectElement.appendChild(option));
}

function populateResults(metadata, data) {
    let outputs = parseMetadata(metadata, data, "Output");

    for (let i = 0; i < outputs.length; i++) {
        let id = outputs[i].id;
        var label = $("<label>").prop("for", id).text(outputs[i].label);
        var output = $("<input>")
            .prop("id", id)
            .prop("type", "text")
            .prop("readonly", true)
        var unit = $("<label>").prop("for", id).text(outputs[i].unit);

        $("#output")
            .append(label)
            .append(output)
            .append(unit)
            .append("<br>");
    }

    updateResults(metadata, data);
    $('#input').on('change', function() {
        updateResults(metadata, data);
    });
}

function updateResults(metadata, data) {
    let inputs = parseMetadata(metadata, data, "Input");
    let outputs = parseMetadata(metadata, data, "Output");

    let matchingRow = true;
    for (let i = 1; i < data.length; i++) {
        matchingRow = true;
        for (let j = 0; j < inputs.length; j++) {
            let idx = data[0].indexOf(inputs[j].key);
            let dataVal = data[i][idx];
            let inputVal = $(`select#${inputs[j].id}`).val();
            if (dataVal != inputVal) {
                matchingRow = false;
                break;
            }
        }

        if (matchingRow) {
            for (let j = 0; j < outputs.length; j++) {
                let output = data[i][outputs[j].dataColumn];
                $(`input#${outputs[j].id}`).val(output);
            }

            break;
        }
    }
}
