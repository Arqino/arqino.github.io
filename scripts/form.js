function showFileName(name = "") {
    let file = document.getElementById('fileUpload' + name);
    let filename = file.files.item(0).name;
    let chosen = document.getElementById('file' + name);

    chosen.innerHTML = "Current file for upload is <strong>" + filename + "</strong>"; 
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" tab-active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " tab-active";
  document.getElementById("dvCSV").innerHTML = "";
}


function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }


function update() {
    var fileUpload = document.getElementById("fileUpload_tags");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            var widgetID;
            reader.onload = function (e) { 
                var result = CSVToArray(e.target.result, ",");

                var pRows = document.createElement("p");
                pRows.innerHTML = "Rows read: <strong> " + result.length + " (including header)</strong>";

                result.splice(0, 1);

                let dvCSV = document.getElementById("dvCSV");

                dvCSV.appendChild(pRows);
                console.log('parsed', result);
                getCardsOnBoard(result);

                // alert('Done!');
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}

function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            var widgetID;
            reader.onload = function (e) { 
                var table = document.createElement("table");

                var result = CSVToArray(e.target.result, ",");

                const cards = [] 
                var xParam = 2765.0162210794065; var yParam = 429.84819860612595; 
                var pRows = document.createElement("p");
                pRows.innerHTML = "Rows read: <strong> " + result.length + " (including header)</strong>";
                var pCards = document.createElement("p");
                pCards.innerHTML = "Cards created: <strong>" + (result.length - 1) + "</strong>";

                for (var i = 1; i < result.length; i++) {
                    if (i % 10 == 0) { xParam = xParam + 285; yParam = 429.84819860612595;  }
                    yParam = yParam + 100;
                    var card = {}; 
                    card.type = "card";
                    card.title = result[i][0];
                    card.description = result[i][1]; 
                    card.x =  xParam;
                    card.y = yParam;
                    var tags = [];

                    for (var j = 2; j < result[i].length; j++) {
                        tags.push(result[i][j]);
                    }

                    cards.push({
                            data: card,
                            tags: tags 
                        });
                }

                createCards(cards);

                let dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = ""; 
                dvCSV.appendChild(pRows); 
                dvCSV.appendChild(pCards);

                // alert('Done!');
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}


async function createCards(cards) {
    for (const card of cards) {
        await createCard(card)
    }
    alert('Done!');
}

async function createCard(card) {
    widgetID = await miro.board.widgets.create(card.data);
    const tagColors = ['#F24726', '#00AA11', '#298AE2', '#FAD03A', '#0A8770','#8B3AF3', '#E405CE', '#D48918', '#4B5E00', '#0D1774']
    for (let i = 0; i < card.tags.length; i++) {
        var tag = card.tags[i]
        tag = tag.replace(/(\r\n|\n|\r)/gm, "");
        const newTag = await createTag(tag, widgetID, tagColors[i])
    }
}

async function createTag(tagName, widgets, color) {
    var tags = await miro.board.tags.get({title: tagName});

    if (tags.length) {
        // console.log('Update tag' + tagName, widgets);
        var currentIDs = tags[0].widgetIds;

        // var id = widgets[0] == undefined ? widgets.id : widgets[0].id
        for (let i = 0; i < widgets.length; i++) {
            currentIDs.push(widgets[i].id);
        }
        
        return await miro.board.tags.update({ id : tags[0].id, widgetIds: currentIDs});
    } else {
        // console.log('create tag' + tagName, widgets);
        // console.log(widgets);
        var ids = [];
        for (let i = 0; i < widgets.length; i++) {
            ids.push(widgets[i].id);
        }
        // console.log(ids);
        return await miro.board.tags.create({title: tagName, color: color, widgetIds: ids});
    }
}

async function getCardsOnBoard(csvArray) {  
    
    var cards =  await miro.board.widgets.get();
    let cardsCounter = 0;

    console.log('args and cards', csvArray);
    
    for (const row of csvArray) { 
        var foundWidgets = cards.filter(element => element.title == row[0]);

        if (foundWidgets.length === 0) {
            console.log('no card with name ' + row[0] + '. Exiting.');
            return;
        }

        var tags = []; 
        for (let i = 2; i < row.length; i++) {
            tags.push(row[i]);
        } 
        console.log(tags, foundWidgets);

        cardsCounter = cardsCounter + foundWidgets.length;
            
        const tagColors = ['#FF1485', '#43E8B6', '#C9F223', '#FF9A51', '#E755FF','#5E0000']
        for (let i = 0; i < tags.length; i++) {
            var tag = tags[i]
            // console.log('before', tag)
            const newTag = await createTag(tag, foundWidgets, tagColors[i]); 
            // console.log('after', newTag)
        }
    } 

    var pCards = document.createElement("p");
    pCards.innerHTML = "Cards updated: <strong>" + cardsCounter + "</strong>";

    let dvCSV = document.getElementById("dvCSV");
    dvCSV.appendChild(pCards);
    alert('Done!');
} 

var selectedWidgets;

// For ALL_WIDGETS_LOADED event, we need to check if widgets
// are already loaded before subscription
// async function onAllWidgetsLoaded() {

//     // await miro.addListener('SELECTION_UPDATED', widget => {
//     //     //console.log(widget.data);
//     //     let selectedCardsText = document.getElementById('selected-cards');
//     //     selectedCardsText.innerHTML = widget.data.length;
//     //     selectedWidgets = widget.data;
//     // })
// }
// onAllWidgetsLoaded(() => {
//   console.log('all widgets are loaded')
// })

miro.onReady(() => {
    miro.addListener('SELECTION_UPDATED', widget => {  
        let selectedCardsText = document.getElementById('selected-cards');
        selectedCardsText.innerHTML = widget.data.length;
        selectedWidgets = widget.data;
        console.log(selectedWidgets);
    })
})

function exportCSV() {

    console.log(selectedWidgets); 

    if (selectedWidgets.length) {

        getCardDetails(selectedWidgets);
    }

}


function createCSV(rows) {

    let filename = document.getElementById('export_filename').value;

    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");
    
    var encodedUri = encodeURI(csvContent);
    
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    // let dvCSV = document.getElementById("dvCSV");
    // dvCSV.appendChild(link);
    link.click();
}

async function getCardDetails(widgets) {

    let rows = ["Title", "Description", "Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];

    for (widget of widgets) {
        let card = await miro.board.widgets.get({id : widget.id});
        let result = [];

        if (card.length) {
            result = [ card[0].title, card[0].description ];
        
            for (let i = 0; i < card[0].tags.length; i++) {
                result.push(card[0].tags[i].title)
            }
        }

        rows.push(result);
    }

    createCSV(rows);
    

    console.log(rows);

}

    
