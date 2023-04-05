const timeEl= document.getElementById('time');
const dateEl= document.getElementById('date');
const currentweatheritemsEl= document.getElementById('currentweatheritems');
const timezoneEl= document.getElementById('time-zone');
const countryEl= document.getElementById('country');
const weatherforecastEl= document.getElementById('weather-forecast');
const currenttempEl =document.getElementById('current-temp');

const days =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY='8a4ecb9e83c1d6e34c3a3f37819b8524';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth(); //will return values from 0-11
    const date = time.getDate();
    const day = time.getDay(); //will return values from 0-6
    const hours = time.getHours();
    const hoursin12 = hours>=13 ? hours%12:hours //converting 24 hour clock into 12 hour clock
    const min = time.getMinutes(); 
    const ampm = hours>=12 ? 'PM' : 'AM'

    //changing the date and time according to the current date and time
    timeEl.innerHTML=(hoursin12<10? '0'+hoursin12:hoursin12)+ ':' +(min < 10? '0'+min:min)+ ' '+ `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML=days[day]+ ',' +date+ ' ' +months[month]

}, 1000); //getting interval every 1 sec
getWeatherData()
// To get the data from the openweathermap API
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let{latitude, longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={hourly,minutely}&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data => {
            console.log(data)
            showWeatherData(data) //To display the data on website
        })
    })
}
function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed}=data.current;//getting the data from current section in the API called
    timezoneEl.innerHTML=data.timezone;
    countryEl.innerHTML=data.lat+'N'+ data.lon+'E'
    currentweatheritemsEl.innerHTML = 
    `
    <div class="weatheritem">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weatheritem">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weatheritem">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weatheritem">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weatheritem">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    `;
    let otherDayforecast=''
    data.daily.forEach((day,idx)=>{
        if(idx==0){
            currenttempEl.innerHTML =`
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">${day.temp.night}&#176; C</div> 
                <div class="temp">${day.temp.day}&#176; C</div>
            </div> 
            `
        }else{
            otherDayforecast += `
            <div class="weather-forecast-items">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">${day.temp.night}&#176; C</div> 
                <div class="temp">${day.temp.day}&#176; C</div>
            </div>
            `
        }
    })
    weatherforecastEl.innerHTML = otherDayforecast;
}