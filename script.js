const API_ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m&forecast_days=10";

async function getWeatherData() {
  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    console.log(data); // Смотрим ответ от API

    const weatherTable = document.createElement("table");
    weatherTable.innerHTML = `<tr><td colspan="3">Погода на ближайшие 10 дней</td></tr>
                              <tr>
                                <th>Дата</th>
                                <th>День недели</th>
                                <th>Погода</th>
                              </tr>`;

    // Проверяем все ли пришло
    if (data && data.hourly && data.hourly.time && data.hourly.temperature_2m) {
      const uniqueDates = new Set(); // Используем Set для хранения уникальных дат

      for (let i = 0; i < data.hourly.time.length; i++) {
        const date = new Date(data.hourly.time[i]);
        const dateString = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
        const dayOfWeekIndex = date.getDay();
        const dayOfWeek = ["вс", "пн", "вт", "cp", "чт", "пт", "сб"][dayOfWeekIndex];
        const weatherCode = data.hourly.temperature_2m[i];

        // Проверяем, есть ли уже запись для этой даты
        if (!uniqueDates.has(dateString)) {
          uniqueDates.add(dateString); // Добавляем дату в Set, чтобы избежать дублирования
          const row = document.createElement("tr");
          row.innerHTML = `<td>${dateString}</td>
                           <td>${dayOfWeek}</td>
                           <td>${weatherCode}</td>`;

          weatherTable.appendChild(row);
        }
      }

      document.body.appendChild(weatherTable);
    } else {
      console.error("Некорректные данные о погоде");
    }
  } catch (error) {
    console.error("Ошибка при получении данных о погоде: " + error);
  }
}

getWeatherData();
