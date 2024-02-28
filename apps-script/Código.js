const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1fiLpqJzUmID05-5_PJg2b3RMULnVbau1uVEOg2GI4Yg/edit#gid=0");
const sheet = sheets.getSheetByName("log-serv");
const sheetAgenda = sheets.getSheetByName("agenda");

function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}

// HAVE TO INCLUDE DESCONTO + NOVO
function doInsertData(data) {
  try
  {
    // Check if data is valid
    if (!isValidData(data))
    {
      throw new Error("Invalid data provided.");
    }

    // Prepare row data
    const rowData = [
      data.data,
      joinIfArray(data.categorias),
      joinIfArray(data.especialista),
      data.descricao,
      data.valor,
      joinIfArray(data.desconto),
      data.nome,
      data.sobrenome,
      data.novo
    ];

    // Find the row index of existing data, if any
    const rowIndex = findRowIndex(data);

    if (rowIndex !== -1)
    {
      // Editing existing row
      const row = sheet.getRange(rowIndex + 1, 1, 1, rowData.length);
      row.setValues([rowData]);
    } else
    {
      // Adding new row
      sheet.appendRow(rowData);
    }

    return "Your message was successfully sent to the Google Sheet database!";
  } catch (error)
  {
    return "Error: " + error.message;
  }
}

function joinIfArray(input, separator = ', ') {
  return Array.isArray(input) ? input.join(separator) : input;
}

// function doInsertData(data) {
//   try
//   {
//     // Check if data is valid
//     if (!isValidData(data))
//     {
//       throw new Error("Invalid data provided.");
//     }

//     // Format "valor" as a number
//     const valor = parseFloat(data.valor.replace(',', '.'));

//     // Prepare row data
//     const rowData = [
//       data.data,
//       joinIfArray(data.categorias),
//       joinIfArray(data.especialista),
//       data.descricao,
//       valor,
//       joinIfArray(data.desconto),
//       data.nome,
//       data.sobrenome,
//       data.novo
//     ];

//     const rowIndex = findRowIndex(data);

//     if (rowIndex !== -1)
//     {
//       // Editing existing row
//       const row = sheet.getRange(rowIndex + 1, 1, 1, rowData.length);
//       row.setValues([rowData]);
//     } else
//     {
//       // Adding new row
//       sheet.appendRow(rowData);
//     }

//     return ContentService.createTextOutput("Data successfully updated in the Google Sheet.");
//   } catch (error)
//   {
//     return ContentService.createTextOutput("Error: " + error.message);
//   }
// }

//have to fix
function doDeleteData(data) {
  const rowIndex = findRowIndex(data);
  if (rowIndex !== -1)
  {
    sheet.deleteRow(rowIndex + 1);
    return ContentService.createTextOutput(`Row ${rowIndex + 1} was successfully deleted from the Google Sheet database!`);
  }
  return ContentService.createTextOutput("Error: Row not found.");
}

function isValidData(data) {
  return data && data.data && data.nome && data.sobrenome && data.descricao && data.valor && data.categorias && data.especialista;
}

function findRowIndex(data) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  for (let i = 0; i < values.length; i++)
  {
    const rowData = values[i];
    if (
      rowData[0] === data.data &&
      rowData[1] === data.categorias &&
      rowData[2] === data.especialista &&
      rowData[3] === data.descricao &&
      rowData[4] === data.valor &&
      rowData[5] === data.nome &&
      rowData[6] === data.sobrenome
    )
    {
      return i;
    }
  }
  return -1; // Row not found
}



//REVER////REVER////
// function doGet(e) {
//   // Create a template from the index.html file
//   var template = HtmlService.createTemplateFromFile("index");

//   // Parse the request parameter to determine the requested route
//   var route = e.parameter.route || 'home'; // Default to 'home' if no route is specified

//   // Serve different HTML content based on the requested route
//   switch (route)
//   {
//     case 'home':
//       // Render the Cadastro component for the "/" route
//       template.data = { pageTitle: 'Cadastro' };
//       break;
//     case 'agenda':
//       // Render the Agenda component for the "/agenda" route
//       template.data = { pageTitle: 'Agenda' };
//       break;
//     default:
//       // If an invalid route is requested, default to serving the Cadastro component
//       template.data = { pageTitle: 'Cadastro' };
//   }

//   // Evaluate the template and return it as the response
//   return template.evaluate()
//     .setTitle('Studio Resources')
//     .setSandboxMode(HtmlService.SandboxMode.IFRAME);
// }


function formatDate(date) {
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}

// Function to format the time to display in the format "hh:mm"
function formatTime(date) {
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  return hours + ":" + minutes;
}


//NAO ESTOU USANDO
function writeCalendarEventsToSheet() {
  var calendar = CalendarApp.getDefaultCalendar();
  var now = new Date();
  var end = new Date();
  end.setDate(now.getDate() + 60); // Get events for the next 30 days

  var events = calendar.getEvents(now, end);

  // Limpa os dados existentes na planilha
  sheetAgenda.clear();

  // Define os cabeçalhos na primeira linha da planilha
  sheetAgenda.getRange('A1:E1').setValues([["Data", "Evento", "Inicio", "Termino"]]);

  // Adiciona os dados dos eventos na planilha
  var rowData = [];
  events.forEach(function (event) {
    var date = formatDate(event.getStartTime());
    var startTime = formatTime(event.getStartTime());
    var endTime = formatTime(event.getEndTime());
    rowData.push([date, event.getTitle(), startTime, endTime, event.getDescription()]);
  });

  // Escreve os dados na planilha a partir da segunda linha
  if (rowData.length > 0)
  {
    sheetAgenda.getRange(sheetAgenda.getLastRow() + 1, 1, rowData.length, rowData[0].length).setValues(rowData);
    console.log('Eventos foram escritos na planilha com sucesso.');
  } else
  {
    console.log('Nenhum evento encontrado para escrever na planilha.');
  }
  console.log(rowData)

  // Return the events data to be used in the client-side function
  return rowData;
}

//OK USANDO
function getCalendarEvents() {
  var calendar = CalendarApp.getDefaultCalendar();
  var now = new Date();
  var end = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)); // 30 days from now
  var events = calendar.getEvents(now, end);
  var eventData = events.map(function (event) {
    return [
      Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "dd-MM-yyyy"),
      event.getTitle(),
      Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "HH:mm"),
      Utilities.formatDate(event.getEndTime(), Session.getScriptTimeZone(), "HH:mm"),
      event.getDescription()
    ];
  });
  return eventData;
}


function getSumOfValues() {
  const range = sheet.getDataRange();
  const values = range.getValues();
  let sum = 0;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1); // First day of the current month
  const endDate = new Date(currentYear, currentMonth + 1, 0); // Last day of the current month

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]); // Assuming date is in the first column
    const valor = parseFloat(values[i][4].toString().replace(',', '.'));

    if (!isNaN(valor) && date >= startDate && date <= endDate)
    {
      sum += valor;
    }
  }

  const lastRow = values[values.length - 1];
  const lastRowDate = new Date(lastRow[0]);
  const lastRowValor = parseFloat(lastRow[4].toString().replace(',', '.'));

  if (lastRow[0] && !isNaN(lastRowValor) && lastRowDate >= startDate && lastRowDate <= endDate)
  {
    sum += lastRowValor;
  }

  console.log("Sum of values:", sum);
  return sum;
}

// 
function getSumOfPreviousMonth() {
  const range = sheet.getDataRange();
  const values = range.getValues();
  let sum = 0;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calcula o mês anterior
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(previousYear, previousMonth, 1); // Primeiro dia do mês anterior
  const endDate = new Date(currentYear, currentMonth, 0); // Último dia do mês anterior

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]); // Supondo que a data esteja na primeira coluna
    const valor = parseFloat(values[i][4].toString().replace(',', '.'));

    if (!isNaN(valor) && date >= startDate && date <= endDate)
    {
      sum += valor;
    }
  }

  const lastRow = values[values.length - 1];
  const lastRowDate = new Date(lastRow[0]);
  const lastRowValor = parseFloat(lastRow[4].toString().replace(',', '.'));

  if (lastRow[0] && !isNaN(lastRowValor) && lastRowDate >= startDate && lastRowDate <= endDate)

    if (lastRow[0] && !isNaN(lastRowValor) && lastRowDate >= startDate && lastRowDate <= endDate)
    {
      sum += lastRowValor;
    }

  console.log("Sum of values for the previous month:", sum);
  return sum;
}

function getPercentageMonth() {

}

function topClients() {

}

function topServices() {

}