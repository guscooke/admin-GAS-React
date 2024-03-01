const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1fiLpqJzUmID05-5_PJg2b3RMULnVbau1uVEOg2GI4Yg/edit#gid=0");
const sheet = sheets.getSheetByName("log-serv");
const sheetAgenda = sheets.getSheetByName("agenda");

function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doInsertData(data) {
  try
  {
    if (!isValidData(data))
    {
      throw new Error("Invalid data provided.");
    }

    const pagamento = data.pagamento === 'cartao' ? 'Cartão' : 'Dinheiro'; // Transforma o valor do botão de rádio em 'Cartão' ou 'Dinheiro'
    const rowData = [
      data.data,
      joinIfArray(data.categorias),
      joinIfArray(data.especialista),
      data.descricao,
      data.valor,
      joinIfArray(data.desconto),
      data.nome,
      data.sobrenome,
      data.novo,
      pagamento // Armazena o valor transformado em 'Cartão' ou 'Dinheiro'
    ];

    const rowIndex = findRowIndex(data);

    if (rowIndex !== -1)
    {
      const row = sheet.getRange(rowIndex + 1, 1, 1, rowData.length);
      row.setValues([rowData]);
    } else
    {
      sheet.appendRow(rowData);
    }

    return "Your message was successfully sent to the Google Sheet database!";
  } catch (error)
  {
    return "Error: " + error.message;
  }
}

function doDeleteData(data) {
  const rowIndex = findRowIndex(data);
  if (rowIndex !== -1)
  {
    sheet.deleteRow(rowIndex + 1);
    return "Row " + (rowIndex + 1) + " was successfully deleted from the Google Sheet database!";
  }
  return "Error: Row not found.";
}

function isValidData(data) {
  return data && data.data && data.nome && data.sobrenome && data.descricao && data.valor && data.categorias && data.especialista && data.pagamento !== undefined; // Ensure pagamento is not undefined
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
      rowData[6] === data.sobrenome &&
      rowData[9] === data.pagamento // Check for pagamento equality
    )
    {
      return i;
    }
  }
  return -1; // Row not found
}

function joinIfArray(input, separator = ', ') {
  return Array.isArray(input) ? input.join(separator) : input;
}

function formatDate(date) {
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}

function formatTime(date) {
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  return hours + ":" + minutes;
}

function writeCalendarEventsToSheet() {
  var calendar = CalendarApp.getDefaultCalendar();
  var now = new Date();
  var end = new Date();
  end.setDate(now.getDate() + 60); // Get events for the next 30 days

  var events = calendar.getEvents(now, end);

  sheetAgenda.clear();
  sheetAgenda.getRange('A1:E1').setValues([["Data", "Evento", "Inicio", "Termino"]]);

  var rowData = [];
  events.forEach(function (event) {
    var date = formatDate(event.getStartTime());
    var startTime = formatTime(event.getStartTime());
    var endTime = formatTime(event.getEndTime());
    rowData.push([date, event.getTitle(), startTime, endTime, event.getDescription()]);
  });

  if (rowData.length > 0)
  {
    sheetAgenda.getRange(sheetAgenda.getLastRow() + 1, 1, rowData.length, rowData[0].length).setValues(rowData);
    console.log('Eventos foram escritos na planilha com sucesso.');
  } else
  {
    console.log('Nenhum evento encontrado para escrever na planilha.');
  }

  return rowData;
}

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

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
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

function getSumOfPreviousMonth() {
  const range = sheet.getDataRange();
  const values = range.getValues();
  let sum = 0;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(previousYear, previousMonth, 1);
  const endDate = new Date(currentYear, currentMonth, 0);

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
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

  console.log("Sum of values for the previous month:", sum);
  return sum;
}

function topServices() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  const serviceCounts = {};

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
    const services = values[i][1].split(',');

    if (date >= startDate && date <= endDate)
    {
      services.forEach(service => {
        service = service.trim();
        if (service !== '')
        {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        }
      });
    }
  }

  const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);
  return sortedServices.slice(0, 5);
}

function topClients() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  const clientCounts = {};

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
    const client = `${values[i][6]} ${values[i][7]}`.trim();

    if (date >= startDate && date <= endDate)
    {
      if (client !== '')
      {
        clientCounts[client] = (clientCounts[client] || 0) + 1;
      }
    }
  }

  const sortedClients = Object.keys(clientCounts).sort((a, b) => clientCounts[b] - clientCounts[a]);
  return sortedClients.slice(0, 5);
}

function getTopServicesAndClients() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  const serviceCounts = {};
  const clientCounts = {};

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
    const services = values[i][1].split(',');
    const client = `${values[i][6]} ${values[i][7]}`.trim();

    if (date >= startDate && date <= endDate)
    {
      services.forEach(service => {
        service = service.trim();
        if (service !== '')
        {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        }
      });

      if (client !== '')
      {
        clientCounts[client] = (clientCounts[client] || 0) + 1;
      }
    }
  }

  const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);
  const sortedClients = Object.keys(clientCounts).sort((a, b) => clientCounts[b] - clientCounts[a]);

  const topServices = sortedServices.slice(0, 5);
  const topClients = sortedClients.slice(0, 5);

  return {
    topServices: topServices,
    topClients: topClients
  };
}

function getCadastro() {
  try
  {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const dataValues = dataRange.getValues();
    const events = [];

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
        novo: typeof row[8] === 'boolean' ? row[8] : false,
        pagamento: row[9] || '' // Include the new pagamento field
      };

      events.push(eventData);
    }

    return JSON.stringify(events);
  } catch (error)
  {
    throw new Error("An error occurred while fetching events: " + error);
  }
}





