async function main(){
  const pois = await getPOI();
  fillTable(pois);
}

/**
* @desc get POIS
* @desc fetches all POI from server
*/
async function getPOI(){
  const response = await fetch('/poi').then(
    response => response.json()
  ).then(data => {
    return data
  }).catch((error) => {
    console.error('Error:', error);
  });;
  return response;
}

/**
* @desc fill table
* @param data Featurecollection fetched from server
*/
function fillTable(data){
  const tableBody = document.getElementById("tableBody");
  let tableHTML = ""

  for(poi of data.features){
    tableHTML += `
    <tr>
    <td>${poi.properties.name}</td>
    <td>${poi.properties.elevation}</td>
    <td>${poi.properties.url}</td>
    <td>${poi.properties.beschreibung}</td>
    <td><input type="checkbox" name="deleteID" value="${poi._id}"></td>
    </tr>
    `
  }

  tableBody.innerHTML = tableHTML;
}

/**
* @desc look at table and submit the delete request
*/
async function submitData(){
  const tableRows = document.getElementsByName("deleteID");

  let toDelete = [];

  for(row of tableRows){
    if(row.checked){
      toDelete.push(row.value);
    }
  }

  const formData = new FormData();
  formData.append('ids', toDelete);

  let redirect = await fetch('/poi', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ids: toDelete})
  })
  //reload to update
  location.reload(true);
}

