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


// ESTOU USANDO
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

//////////////////////////////////////////////////////
// Função para encontrar os cinco serviços mais feitos no mês atual
function topServices() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1); // Primeiro dia do mês atual
  const endDate = new Date(currentYear, currentMonth + 1, 0); // Último dia do mês atual

  const serviceCounts = {}; // Objeto para armazenar a contagem de cada serviço

  // Itera sobre os dados para contar a ocorrência de cada serviço
  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]); // Supondo que a data esteja na primeira coluna
    const services = values[i][1].split(','); // Supondo que os serviços estejam na segunda coluna e separados por vírgula

    if (date >= startDate && date <= endDate)
    {
      services.forEach(service => {
        service = service.trim(); // Remove espaços em branco em excesso
        if (service !== '')
        {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1; // Incrementa a contagem para este serviço
        }
      });
    }
  }

  // Ordena os serviços com base em suas contagens
  const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);

  // Retorna os cinco serviços mais feitos
  return sortedServices.slice(0, 5);
}

// Função para encontrar os cinco clientes que mais aparecem no cadastro no mês atual
function topClients() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1); // Primeiro dia do mês atual
  const endDate = new Date(currentYear, currentMonth + 1, 0); // Último dia do mês atual

  const clientCounts = {}; // Objeto para armazenar a contagem de cada cliente

  // Itera sobre os dados para contar a ocorrência de cada cliente
  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]); // Supondo que a data esteja na primeira coluna
    const client = `${values[i][6]} ${values[i][7]}`.trim(); // Supondo que o nome e sobrenome do cliente estejam na sétima e oitava coluna

    if (date >= startDate && date <= endDate)
    {
      if (client !== '')
      {
        clientCounts[client] = (clientCounts[client] || 0) + 1; // Incrementa a contagem para este cliente
      }
    }
  }

  // Ordena os clientes com base em suas contagens
  const sortedClients = Object.keys(clientCounts).sort((a, b) => clientCounts[b] - clientCounts[a]);

  // Retorna os cinco clientes que mais aparecem
  return sortedClients.slice(0, 5);
}

////
// Código no Google Apps Script

// Função para buscar os cinco serviços mais feitos e os cinco clientes que mais aparecem no mês atual
function getTopServicesAndClients() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1); // Primeiro dia do mês atual
  const endDate = new Date(currentYear, currentMonth + 1, 0); // Último dia do mês atual

  const serviceCounts = {}; // Objeto para armazenar a contagem de cada serviço
  const clientCounts = {}; // Objeto para armazenar a contagem de cada cliente
  const specialistCounts = {}; // Objeto para armazenar a contagem de cada especialista

  // Itera sobre os dados para contar a ocorrência de cada serviço, cliente e especialista
  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]); // Supondo que a data esteja na primeira coluna
    const services = values[i][1].split(','); // Supondo que os serviços estejam na segunda coluna e separados por vírgula
    const client = `${values[i][6]} ${values[i][7]}`.trim(); // Supondo que o nome e sobrenome do cliente estejam na sétima e oitava coluna
    const specialists = values[i][2].split(','); // Supondo que os especialistas estejam na terceira coluna e separados por vírgula

    if (date >= startDate && date <= endDate)
    {
      services.forEach(service => {
        service = service.trim(); // Remove espaços em branco em excesso
        if (service !== '')
        {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1; // Incrementa a contagem para este serviço
        }
      });

      if (client !== '')
      {
        clientCounts[client] = (clientCounts[client] || 0) + 1; // Incrementa a contagem para este cliente
      }

      specialists.forEach(specialist => {
        specialist = specialist.trim(); // Remove espaços em branco em excesso
        if (specialist !== '')
        {
          specialistCounts[specialist] = (specialistCounts[specialist] || 0) + 1; // Incrementa a contagem para este especialista
        }
      });
    }
  }

  // Ordena os serviços com base em suas contagens
  const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);

  // Ordena os clientes com base em suas contagens
  const sortedClients = Object.keys(clientCounts).sort((a, b) => clientCounts[b] - clientCounts[a]);

  // Ordena os especialistas com base em suas contagens
  const sortedSpecialists = Object.keys(specialistCounts).sort((a, b) => specialistCounts[b] - specialistCounts[a]);

  // Retorna os cinco principais serviços, clientes e especialistas
  const topServices = sortedServices.slice(0, 5);
  const topClients = sortedClients.slice(0, 5);
  const topSpecialists = sortedSpecialists.slice(0, 5);

  return {
    topServices: topServices,
    topClients: topClients,
    topSpecialists: topSpecialists
  };
}

// function getCadastro() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   var dataRange = sheet.getDataRange();
//   var dataValues = dataRange.getValues();
//   var events = [];

//   // Iterating over rows and pushing data to 'events' array
//   for (var i = 0; i < dataValues.length; i++)
//   {
//     events.push(dataValues[i]);
//   }
//   // Returning the array of events
//   return events;
// }

// function getCadastro() {
//   try
//   {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     var dataRange = sheet.getDataRange();
//     var dataValues = dataRange.getValues();
//     var events = [];

//     // Iterate over rows and push data to 'events' array
//     for (var i = 1; i < dataValues.length; i++)
//     {
//       var row = dataValues[i];
//       var eventData = {
//         data: row[0] instanceof Date ? row[0] : null, // Check if it's a date object
//         serviço: row[1] || '', // Ensure a default value if empty
//         profissional: row[2] || '',
//         descrição: row[3] || '',
//         valor: typeof row[4] === 'number' ? row[4] : null, // Check if it's a number
//         desconto: typeof row[5] === 'number' ? row[5] : null,
//         nome: row[6] || '',
//         sobrenome: row[7] || '',
//         novo: typeof row[8] === 'boolean' ? row[8] : false // Check if it's a boolean
//       };

//       events.push(eventData);
//     }

//     // Returning the array of events
//     return events;
//   } catch (error)
//   {
//     throw new Error("An error occurred while fetching events: " + error);
//   }
// }

// Define global variables
// const spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1fiLpqJzUmID05-5_PJg2b3RMULnVbau1uVEOg2GI4Yg/edit#gid=0");
// const logSheet = spreadsheet.getSheetByName("log-serv");
// const agendaSheet = spreadsheet.getSheetByName("agenda");

function getCadastro() {
  try
  {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const dataValues = dataRange.getValues();
    const events = [];

    // Iterate over rows and push data to 'events' array
    for (let i = 1; i < dataValues.length; i++)
    {
      const row = dataValues[i];
      const desconto = typeof row[5] === 'string' ? row[5].split(',') : null;
      const eventData = {
        data: row[0] instanceof Date ? row[0].toISOString() : null,
        servico: row[1] || '',
        profissional: row[2] || '',
        descricao: row[3] || '',
        valor: typeof row[4] === 'number' ? row[4] : null,
        desconto: desconto,
        nome: row[6] || '',
        sobrenome: row[7] || '',
        novo: typeof row[8] === 'boolean' ? row[8] : false
      };

      events.push(eventData);
    }

    // Returning the array of events as a JSON string
    return JSON.stringify(events);
  } catch (error)
  {
    throw new Error("An error occurred while fetching events: " + error);
  }
}




