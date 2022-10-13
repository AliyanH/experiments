// Getting Keys
//async function initialize() {
//    let datalist = document.getElementById("key");
//    fetch('https://taginfo.openstreetmap.org/api/4/keys/all?include=prevalent_values&sortname=count_all&sortorder=desc&page=2&rp=999&qtype=key&format=json_pretty')
//        .then((response) => response.json())
//        .then((data) => {
//            data.data.forEach((element, key) => {
//                let option = new Option(element.key, element.key);
//                datalist.appendChild(option);
//            });
//    });
//    console.log(datalist);
//    
//}
let spinner = document.getElementById("spinner");

// ----------------------------------------- Key/Val Search ----------------------------------------- //
// Getting suggested Values for the key used (for Key/Val Search)
async function getValue() {
    let key = document.getElementById('keyInput').value;
    let url = "https://taginfo.openstreetmap.org/api/4/key/values?key=" + key + "&filter=all&lang=en&sortname=count&sortorder=desc&page=1&rp=35&qtype=value&format=json_pretty";
    console.log(url);
    let datalist = document.getElementById("value");

    // remove previous datalist items
    datalist.replaceChildren();

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((element, key) => {
                let option = new Option(element.value, element.value);
                datalist.appendChild(option);
            });
        });
}

// Updates the box variable with the updated bbox on map moveend event
let box = [37.91477147374187, -146.42443833939757, 71.89411232431789, -67.2337764060195];
function setBBOX() {
    let mapExtent = document.querySelector("mapml-viewer").extent;
    let bbox = [mapExtent.bottomRight.gcrs.vertical, mapExtent.topLeft.gcrs.horizontal, mapExtent.topLeft.gcrs.vertical, mapExtent.bottomRight.gcrs.horizontal];
    box = bbox;
    let bboxValue = "(" + mapExtent.bottomRight.gcrs.vertical + "," + mapExtent.topLeft.gcrs.horizontal + "," + mapExtent.topLeft.gcrs.vertical + "," + mapExtent.bottomRight.gcrs.horizontal + ")";
    document.getElementById('bbox').setAttribute("value", bboxValue);
}
document.getElementById('keyInput').addEventListener('focusout', getValue);
document.getElementById("map").addEventListener("moveend", setBBOX);

let keyVal;
// add key val pair to variable
function addKeyValue() {
    let key = document.getElementById('keyInput').value;
    let value = document.getElementById('keyValue').value;
    let out = '["' + key + '"="' + value + '"]';

    keyVal = out;
    console.log(out)
}

async function queryOSM() {
    // Spinner
    spinner.removeAttribute('hidden');
    // Reset any errors
    document.getElementById('error').innerHTML = "";
    addKeyValue()
    let bbox = document.getElementById('bbox').value;
    //let elementType = document.getElementById('type');
    //let elementTypeValue = elementType.options[elementType.selectedIndex].text;
    //(top = 72.50076209775693, left = 175.18686044952838)
    //(bottom = 40.0046719443572, right = -69.51172494561975)

    let url = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:60];(nwr' + keyVal + bbox + ';);out body;>;out skel qt;';
    //let url = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["country"="CA"](-88.18985506998769,-180,88.1898550699877,180););out body;>;out skel qt;';
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText + ': Something went wrong');
        })
        .then((data) => {
            console.log(data);
            if (data.elements.length > 0) { // if there is any output
                let mapml = geojson2mapml(osmtogeojson(data), { label: "Output", caption: "id" });
                // Setting layer extent
                bbox = bbox.replace(/[()]/g, '').split(",");
                mapml.insertAdjacentHTML('afterbegin', '<map-meta name="extent" content="top-left-longitude=' + bbox[1] + ', top-left-latitude=' + bbox[2] + ', bottom-right-longitude=' + bbox[3] + ',bottom-right-latitude=' + bbox[0] + '"></map-meta>');
                // Adding layer to map
                document.querySelector('mapml-viewer').appendChild(mapml);
                }
            else {
                document.getElementById('error').innerHTML = "Received empty dataset.";
                alert("Received empty dataset.");
            }
            spinner.setAttribute('hidden', '');
        })
        .catch((error) => {
            document.getElementById('error').innerHTML = error;
            spinner.setAttribute('hidden', '');
        });
    
    // Reset key/value search
    document.getElementById('output').innerHTML = "";
}
// ----------------------------------------- Key/Val Search ----------------------------------------- //



// ----------------------------------------- QL Query ----------------------------------------- //
// removes comments from QL, used in searchQL()
function removeComments(string) {
    //Takes a string of code, not an actual function.
    return string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();//Strip comments
}

// Query using QL textarea
async function searchQL() {
    // spinner
    spinner.removeAttribute('hidden');
    // clearing any errors
    document.getElementById('error').innerHTML = "";
    // get bbox 
    let mapExtent = document.querySelector("mapml-viewer").extent;
    let bboxValue = "(" + mapExtent.bottomRight.gcrs.vertical + "," + mapExtent.topLeft.gcrs.horizontal + "," + mapExtent.topLeft.gcrs.vertical + "," + mapExtent.bottomRight.gcrs.horizontal + ")";

    let QL = document.getElementById('query').value;
    QL = QL.replace(/\({{bbox}}\)/g, bboxValue);
    QL = removeComments(QL)
    console.log(QL);

    let url = 'https://overpass-api.de/api/interpreter?data=' + QL; //[out:json][timeout:60];
    console.log(url);

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText + ': Something went wrong');
        })
        .then((data) => {
            console.log(data);
            let mapml = geojson2mapml(osmtogeojson(data), { label: "Output", caption: "id" });

            // Setting layer extent
            let bbox = bboxValue.replace(/[()]/g, '').split(",");
            mapml.insertAdjacentHTML('afterbegin', '<map-meta name="extent" content="top-left-longitude=' + bbox[1] + ', top-left-latitude=' + bbox[2] + ', bottom-right-longitude=' + bbox[3] + ',bottom-right-latitude=' + bbox[0] + '"></map-meta>');

            // Adding layer to map
            document.querySelector('mapml-viewer').appendChild(mapml);
            spinner.setAttribute('hidden', '');
        })
        .catch((error) => {
            console.log(error)
            document.getElementById('error').innerHTML = error;
            spinner.setAttribute('hidden', '');
        });
}
// ----------------------------------------- QL Query ----------------------------------------- //


// --------------- TAB CONTENT ---------------  //
function openCity(evt, cityName) {
    // Declare all variables
    let i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

    if (cityName === "London") {
        document.getElementById("search").setAttribute("onclick", "searchQL()");
    } else if (cityName === "Paris") {
        document.getElementById("search").setAttribute("onclick", "queryOSM()");
    }
}
document.getElementById("defaultOpen").click();