const openweathermapApiKey = process.env.OPENWEATHERMAP_API_KEY;


export const fetchWeather = async(
    { location }:
    { location: string }
) => {

    let getCoordsData: any;
    let weatherData: any;

    const getCoords = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${openweathermapApiKey}`);
    getCoordsData = await getCoords.json();
    const lat = getCoordsData[0].lat;
    const lon = getCoordsData[0].lon;

    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openweathermapApiKey}`);
    weatherData = await weather.json();
    return {
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: `${Math.round(weatherData.main.temp)}`,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        humidity: `${weatherData.main.humidity}%`,
        wind: `${weatherData.wind.speed} m/s`
    };

}