let cities = {
    "city": "Delhi", 
    "lat": "28.6100", 
    "lng": "77.2300", 
    "country": "India", 
    "iso2": "IN", 
    "admin_name": "Delhi", 
    "capital": "admin", 
  };

//   clock
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour time

    document.getElementById('clock').innerText = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${meridiem}`;
  }

  updateTime();
  setInterval(updateTime, 1000); // Update time every secondy


let setCity = [];
let setDaily = ''

// Fetch Select menu from Json
const fetchSelectMenu = ()=>{
    fetch('./data/in.json')
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        cities = data;
        fillDataSelectMenu(cities);
        getDataByDefault()
    })
    .catch((err)=>{
        console.log('Get Error', err)
    })
}
fetchSelectMenu();

// fill Select menu data
const fillDataSelectMenu = (data)=>{
    let citiOption = [];
    if(data && data.length > 0){
        data.map((item)=>{
            let option = '<option value='+item.city+'>'+item.city+'</option>'
            return citiOption.push(option);
        })
    }
    const allOption = citiOption.join('');
    let selectMenu = document.getElementById('selectMenu');
    selectMenu.innerHTML = allOption;
}

// choose Select Menu Option 
const cooseSelectMenuOption = ()=>{
    const selectMenu =  document.getElementById('selectMenu');
    selectMenu.addEventListener('change', ()=>{
        const slectedValue = selectMenu.value;
        const selectedCity = cities.filter((item)=>{
            return item.city === slectedValue;
        })
        setCity = selectedCity;
        weaterAPIInfoCall();
    })
}
cooseSelectMenuOption();

// byDefaultChoose 
const getDataByDefault = ()=>{
    const slectedValue = 'Delhi';
    const selectedCity = cities.filter((item)=>{
        return item.city === slectedValue;
    })
    setCity = selectedCity;
    weaterAPIInfoCall();
}


// call api Weater info
const weaterAPIInfoCall = ()=>{
    let lat = setCity[0].lat;
    let lng = setCity[0].lng;
    let exclude = 'hourly,minutely';
    
    let APIKEY = '34480b98aa332da53123a0ac63a4ea9d';
    const APIURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=${exclude}&units=metric&lang=tr&appid=${APIKEY}`;

    fetch(APIURL)
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        setDaily = data;
        weekInfoCard()
        LeftCardDataSet(data.daily[0]);
        HumiditySectionData(data.daily[0])
    })
    .catch((error)=>{
        console.log('Get Error ', error)
    })
}

// left Card Section Data Function
let WeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]
const LeftCardDataSet = (data)=>{
    //console.log('data', data)
    let getTime = data.dt * 1000;
    let getFullDateTime = new Date(getTime);
    
    let GetDay = getFullDateTime.getDay();
    let weaterImgUrl = `'http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png';
    ` 
    let dayLeft = document.getElementById('dayLeft');
    let monthLeft = document.getElementById('monthLeft');
    let clImgLeft = document.getElementById('clImgLeft');
    let tempLeft = document.getElementById('tempLeft');
    let textWeaterLeft = document.getElementById('textWeaterLeft');
    dayLeft.innerHTML = WeekDays[GetDay];
    monthLeft.innerHTML = getFullDateTime.toLocaleDateString();
    clImgLeft.innerHTML = '<img src='+weaterImgUrl+' alt="" />';
    tempLeft.innerHTML = `${Math.round(data.temp.day)} .C`;
    textWeaterLeft.innerHTML = `${data.weather[0].main}`
}


// HUMIDITY section data fill 
const HumiditySectionData = (data)=>{
    //console.log(data);
    let uvIndex = document.getElementById('uvIndex');
    let humidity = document.getElementById('humidity');
    let wind = document.getElementById('wind');
    let cityPlace = document.getElementById('cityPlace');


    const GetUVString = (uvIndex)=>{
        if(uvIndex <= 2)return 'Low';
        if(uvIndex <= 5)return 'Medium';
        if(uvIndex <= 7)return 'High';
        if(uvIndex > 7)return 'Very High';
    }

    uvIndex.innerHTML = `${Math.round(data.uvi)} - ${GetUVString(Math.round(data.uvi))}`;
    humidity.innerHTML = `${data.humidity}%`;
    wind.innerHTML = `${data.wind_speed} km/h`

    cityPlace.innerHTML = `${setCity[0].city} - ${setCity[0].city} - ${setCity[0].admin_name} - ${setCity[0].country}`;
    populationcity.innerHTML = `${setCity[0].population}`

}

// WeekinfoCard
const weekInfoCard = ()=>{
    const DailyCardData = setDaily.daily;
    let weekInfoCard = document.getElementById('weekInfoCard');

    let cardInfo = [];

    if(DailyCardData && DailyCardData.length > 1){
        DailyCardData.map((card, index)=>{
            let dayGet = card.dt * 1000;
            let dateGet =  new Date(dayGet);
            let getDay = dateGet.getDay();
            let cardImg = `http://openweathermap.org/img/wn/${card.weather[0].icon}.png`
            let liCardinfo = `<li onclick="setCurrenData(this, ${index})" class="${index === 0 ? 'active': ''}">
                    <div class="cardImg">
                        <img src="${cardImg}" alt="${card.weather[0].main}" />
                    </div>
                    <p class="dayCard">${WeekDays[getDay].slice(0,3)}</p>
                    <p class="tempCard">${Math.round(card.temp.day)}.c</p>
                </li>`;
            if(index < 7){
                return cardInfo.push(liCardinfo)
            }
        })
    }

    weekInfoCard.innerHTML = cardInfo.join('');
}

// click to card 
const setCurrenData = (element, index)=>{
    const lis = document.querySelectorAll('#weekInfoCard li');
    lis.forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    const currentData = setDaily.daily[index]
    LeftCardDataSet(currentData);
    HumiditySectionData(currentData)
}