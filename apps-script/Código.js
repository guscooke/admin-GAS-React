const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1fiLpqJzUmID05-5_PJg2b3RMULnVbau1uVEOg2GI4Yg/edit#gid=0");
const sheet = sheets.getSheetByName("log-serv");
const sheetAgenda = sheets.getSheetByName("agenda");
const sheetCliente = sheets.getSheetByName("cliente");

function createDailyTrigger() {
  // Exclui o gatilho existente, se houver
  deleteDailyTrigger();

  // Define o horário em que deseja que a função seja executada diariamente (à meia-noite)
  const triggerDay = ScriptApp.newTrigger('getReturnAlerts')
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .create();
}

function deleteDailyTrigger() {
  // Exclui o gatilho existente, se houver
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++)
  {
    if (triggers[i].getHandlerFunction() === 'getReturnAlerts')
    {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
///////////////////////////////////////////////////////////////
function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

////////////////////////////////////////////////////////////////
function doInsertData(data) {
  try
  {
    if (!isValidData(data))
    {
      throw new Error("Invalid data provided.");
    }

    // Format the date
    const formattedDate = Utilities.formatDate(new Date(data.data), Session.getScriptTimeZone(), "dd/MM/yyyy");

    // Add one day to the date
    const dateObject = new Date(data.data);
    dateObject.setDate(dateObject.getDate() + 1);
    const formattedDatePlusOneDay = Utilities.formatDate(dateObject, Session.getScriptTimeZone(), "dd/MM/yyyy");

    const pagamento = data.pagamento === 'cartao' ? 'Cartão' : 'Dinheiro'; // Transforma o valor do botão de rádio em 'Cartão' ou 'Dinheiro'
    const rowData = [
      formattedDatePlusOneDay, // Use the adjusted date here
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


///cadastro dos clientes/////
function insertNewClient(clientData) {
  try
  {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("clientes");
    const formattedDate = Utilities.formatDate(new Date(clientData.dataNascimento), Session.getScriptTimeZone(), "dd/MM/yyyy");

    // Append the client data to the sheet
    sheet.appendRow([
      clientData.nome,
      clientData.sobrenome,
      clientData.telefone,
      clientData.email,
      formattedDate
    ]);

    return "New client added successfully.";
  } catch (error)
  {
    return "Error: " + error.message;
  }
}

////rever//////
function doDeleteData(data) {
  const rowIndex = findRowIndex(data);
  if (rowIndex !== -1)
  {
    sheet.deleteRow(rowIndex + 1);
    return "Row " + (rowIndex + 1) + " was successfully deleted from the Google Sheet database!";
  }
  return "Error: Row not found.";
}
////////////////////////////////////////////////////////////////////
function isValidData(data) {
  return data && data.data && data.nome && data.sobrenome && data.descricao && data.valor && data.categorias && data.especialista && data.pagamento !== undefined; // Ensure pagamento is not undefined
}
///////////////////////////////////////////////////////////////
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

//////////////////////////////////
function joinIfArray(input, separator = ', ') {
  return Array.isArray(input) ? input.join(separator) : input;
}
//////////////////////////////////////
function formatTime(date) {
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  return hours + ":" + minutes;
}
/////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////
function getSumOfValues() {
  const range = sheet.getDataRange();
  const values = range.getValues();
  let totalSum = 0;
  let atendimentos = 0; // Inicializa o contador de atendimentos

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  const sumByDay = [];

  for (let i = 1; i < values.length - 1; i++)
  {
    const date = new Date(values[i][0]);
    const valor = parseFloat(values[i][4].toString().replace(',', '.'));

    if (!isNaN(valor) && date >= startDate && date <= endDate)
    {
      totalSum += valor;
      atendimentos++; // Incrementa o contador de atendimentos
      const dayOfMonth = date.getDate();
      sumByDay[dayOfMonth] = atendimentos; // Armazena a quantidade de atendimentos para o dia do mês
    }
  }

  const lastRow = values[values.length - 1];
  const lastRowDate = new Date(lastRow[0]);
  const lastRowValor = parseFloat(lastRow[4].toString().replace(',', '.'));

  if (lastRow[0] && !isNaN(lastRowValor) && lastRowDate >= startDate && lastRowDate <= endDate)
  {
    totalSum += lastRowValor;
    atendimentos++; // Incrementa o contador de atendimentos
    const dayOfMonth = lastRowDate.getDate();
    sumByDay[dayOfMonth] = atendimentos; // Armazena a quantidade de atendimentos para o último dia do mês
  }

  console.log("Total Sum of values:", totalSum);
  console.log("Total atendimentos:", atendimentos);
  console.log("Atendimentos by day:", sumByDay);

  return { totalSum, atendimentos, sumByDay };
}

//////////////////////////////////////////////////////////////////////////////////
function getSumOfPreviousMonth() {
  const range = sheet.getDataRange();
  const values = range.getValues();
  let sum = 0;
  let atendimentos = 0; // Inicializar o contador de atendimentos

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(previousYear, previousMonth, 1);
  const endDate = new Date(currentYear, currentMonth, 0);

  for (let i = 1; i < values.length; i++)
  { // Removido -1 para percorrer todas as linhas
    const date = new Date(values[i][0]);
    const valor = parseFloat(values[i][4].toString().replace(',', '.'));

    if (!isNaN(valor) && date >= startDate && date <= endDate)
    {
      sum += valor;
      atendimentos++; // Incrementar o contador de atendimentos para cada valor válido encontrado
    }
  }

  console.log("Sum of values for the previous month:", sum);
  console.log("Total atendimentos:", atendimentos);

  return { sum, atendimentos };
}

////////////////////////////////////////////////////////////////////
function topServices() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  // const currentWeek = currentWeek.getWeek

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
///////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////
// retornar vendas do mes passado

////////////////////////////////////////////////


//////////////////////////////////3 functions alltogether/////////////////////////////////////////////////
function getTotalReturnServices() {
  const returnAlerts = getReturnAlerts(); // Obter alertas de retorno
  const currentDate = new Date();
  let totalReturnServices = 0;

  const range = sheet.getDataRange();
  const values = range.getValues();

  for (let i = 1; i < values.length; i++)
  {
    const service = values[i][1] ? values[i][1].toString().toLowerCase() : '';

    // Verificar se o serviço é microagulhamento ou retoque micro
    if (service.includes('microagulhamento') || service.includes('retoque micro'))
    {
      continue; // Pular este serviço
    }

    const dateString = values[i][0] ? values[i][0].toString() : '';
    const returnDate = dateString ? new Date(dateString) : null;

    // Verificar se a data de retorno é válida e está dentro do período de alerta
    if (returnDate && returnDate > currentDate && !isInAlertPeriod(returnDate, returnAlerts, currentDate))
    {
      totalReturnServices++;
    }
  }

  console.log('retorno total', totalReturnServices);
  return totalReturnServices;
}

function getReturnServicesByType() {
  const returnAlerts = getReturnAlerts(); // Obter alertas de retorno
  const currentDate = new Date();
  let returnServicesByType = { 'Cílios': 0, 'Micro': 0 };

  const range = sheet.getDataRange();
  const values = range.getValues();

  for (let i = 1; i < values.length; i++)
  {
    const service = values[i][1] ? values[i][1].toString().toLowerCase() : '';

    // Verificar se o serviço é microagulhamento ou retoque micro
    if (service.includes('microagulhamento') || service.includes('retoque micro'))
    {
      continue; // Pular este serviço
    }

    const dateString = values[i][0] ? values[i][0].toString() : '';
    const returnDate = dateString ? new Date(dateString) : null;

    // Verificar se a data de retorno é válida e está dentro do período de alerta
    if (returnDate && returnDate > currentDate && !isInAlertPeriod(returnDate, returnAlerts, currentDate))
    {
      if (service.includes('cílios'))
      {
        returnServicesByType['Cílios']++;
      } else if (service.includes('micro'))
      {
        returnServicesByType['Micro']++;
      }
    }
  }

  console.log('retorno por tipo', returnServicesByType);
  return returnServicesByType;
}

// Função para verificar se a data de retorno está dentro do período de alerta
function isInAlertPeriod(returnDate, returnAlerts, currentDate) {
  for (const alert of returnAlerts)
  {
    if (returnDate <= alert.returnDate && alert.returnDate <= currentDate)
    {
      return true;
    }
  }
  return false;
}



////////////////////////////////////////////////////////////////////////////////////////
function getReturnAlerts() {
  const range = sheet.getDataRange();
  const values = range.getValues();

  let returnAlerts = [];

  const currentDate = new Date();

  for (let i = 1; i < values.length; i++)
  {
    const service = values[i][1] ? values[i][1].toString().toLowerCase() : '';
    const name = values[i][6] ? values[i][6].toString() : '';
    const surname = values[i][7] ? values[i][7].toString() : '';
    const fullName = `${name} ${surname}`;

    if ((service.includes('cílios') || service.includes('micro')) && fullName)
    {
      // Exclude 'microagulhamento' and 'retoque micro'
      if (service.includes('microagulhamento') || service.includes('retoque micro'))
      {
        continue; // Skip this entry
      }

      const dateString = values[i][0] ? values[i][0].toString() : ''; // Convert date value to string
      const returnDate = dateString ? new Date(dateString) : null; // Create Date object or null if dateString is empty

      if (returnDate instanceof Date && !isNaN(returnDate))
      {
        const serviceType = service.includes('cílios') ? 'Cílios' : 'Micro';
        const daysToAdd = serviceType === 'Cílios' ? 12 : 30; // Define os dias a serem adicionados com base no tipo de serviço

        // Adiciona os dias de retorno
        returnDate.setDate(returnDate.getDate() + daysToAdd);

        // Verifica se a data de retorno é maior que a data atual
        if (returnDate > currentDate)
        {
          const alertDate = new Date(returnDate); // Cria uma cópia da data de retorno
          alertDate.setDate(alertDate.getDate() - 5); // Subtrai 5 dias para o alerta

          // Verifica se a data do alerta é maior que a data atual
          if (alertDate > currentDate)
          {
            returnAlerts.push({ name: fullName, serviceType, returnDate, alertDate });
          }
        }
      } else
      {
        console.error(`Invalid or past date value: ${dateString}`);
      }
    }
  }

  console.log('alertas', returnAlerts);
  return returnAlerts;
}

//////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////
function checkUpcomingBirthdays() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("clientes"); // Nome da planilha onde os dados de cadastro estão armazenados
  const today = new Date(); // Data de hoje
  const thisMonth = today.getMonth(); // Mês atual

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  const upcomingBirthdays = [];

  // Iterar sobre os dados dos clientes
  for (let i = 1; i < values.length; i++)
  {
    const rowData = values[i];
    const birthday = new Date(rowData[4]); // Supondo que a data de aniversário esteja na quinta coluna (índice 4)

    // Verificar se o aniversário está neste mês
    if (birthday.getMonth() === thisMonth)
    {
      // Aniversário encontrado para este mês, faça algo com essa informação
      const name = rowData[0]; // Supondo que o nome do cliente esteja na primeira coluna (índice 0)
      const formattedBirthday = `${birthday.getDate()}/${birthday.getMonth() + 1}`; // Formatar a data de aniversário apenas com dia e mês

      // Adicionar o nome e a data de aniversário formatada ao array de aniversários futuros
      upcomingBirthdays.push({ name, formattedBirthday });
      Logger.log(`Aniversário de ${name} em ${formattedBirthday}`);
    }
  }
  return upcomingBirthdays;
}













