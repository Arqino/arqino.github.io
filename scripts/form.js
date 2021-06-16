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
                    result.splice(0, 1);
                    getCardsOnBoard(result);
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
                    // var result = csv.replace(/"[^"]+"/g, function(v) { 
                        
                    //    return v.replace(/(\r\n|\n|\r)/gm, "<br/>").replace(/,/g, '-');
                    // }); 
                    const cards = [] 
                    var xParam = 2765.0162210794065; var yParam = 429.84819860612595; 
                    var pRows = document.createElement("p");
                    pRows.innerHTML = "Rows readed: <strong> " + result.length + " (including header)</strong>";
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

                    var dvCSV = document.getElementById("dvCSV");
                    dvCSV.innerHTML = ""; 
                    dvCSV.appendChild(pRows); 
                    dvCSV.appendChild(pCards);
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
    }

    async function createCard(card) {
        widgetID = await miro.board.widgets.create(card.data);
        const tagColors = ['#F24726', '#00AA11', '#298AE2', '#FAD03A', '#0A8770','#8B3AF3', '#E405CE', '#D48918', '#4B5E00', '#0D1774']
        for (let i = 0; i < card.tags.length; i++) {
            var tag = card.tags[i]
            tag = tag.replace(/(\r\n|\n|\r)/gm, "");
            //console.log('before', tag)
            const newTag = await createTag(tag, widgetID, tagColors[i])
            //console.log('after', newTag)
        }
    }

    async function createTag(tagName, widgetID, color) {
        var tags = await miro.board.tags.get({title: tagName});

        if (tags.length) { // update
            var currentIDs = tags[0].widgetIds;

            var id = widgetID[0] == undefined ? widgetID.id : widgetID[0].id

            currentIDs.push(id);
            
            return await miro.board.tags.update({ id : tags[0].id, widgetIds: currentIDs});
        } else {
            return await miro.board.tags.create({title: tagName, color: color, widgetIds: widgetID});
        }
    }

    async function getCardsOnBoard(csvArray) {  
        var cards =  await miro.board.widgets.get();
        
        
        for (const row of csvArray) { 
           var foundWidgets = cards.filter(element => element.title == row[0]);
            var tags = []; 
            for (var i = 1; i < row.length; i++) {
                tags.push(row[i]);
            } 
console.log(tags);
            // var j = 0;

            if (foundWidgets.length) {
                for (const widget of foundWidgets) {
                    // var widgets = [];
                    // widgets.push(widget);
                    await updateCardsWithNewTags(widget, tags);

                    // for (const tag of tags) {
                    //     await createTag(tag, widget, tagColors[j]);
                    //     j++;
                    // }
                }
            }
        } 
    }

    async function updateCardsWithNewTags(widget, tags) {
        const tagColors = ['#FF1485', '#43E8B6', '#C9F223', '#FF9A51', '#E755FF','#5E0000']
        for (let i = 0; i < tags.length; i++) {
            var tag = tags[i]
            //tag = tag.replace(/(\r\n|\n|\r)/gm, "");  console.log(tag);
            //console.log('before', tag)
            const newTag = await createTag(tag, widget, tagColors[i]); return;
            //console.log('after', newTag)
        }
    }