// استخدم environment variable إذا متوفر، وإلا استخدم الـ API key الافتراضي
const getApiKey = () => {
    // للاستخدام في Vercel مع environment variables
    if (typeof process !== 'undefined' && process.env && process.env.VITE_WEATHER_API_KEY) {
        return process.env.VITE_WEATHER_API_KEY;
    }
    // للاستخدام في المتصفح
    return '9505fd1df737e20152fbd78cdb289b6a';
};

let id = getApiKey();
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=';

// انتظر حتى يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {
    let city = document.querySelector('.name');
    let form = document.querySelector("form");
    let temperature = document.querySelector('.temperature');
    let description = document.querySelector('.description');
    let valueSearch = document.getElementById('name');
    let clouds = document.getElementById('clouds');
    let humidity = document.getElementById('humidity');
    let pressure = document.getElementById('pressure');
    let main = document.querySelector('main');

    // تحقق من وجود جميع العناصر
    if (!form || !valueSearch || !main) {
        console.error('عناصر DOM المطلوبة غير موجودة!');
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();  
        let searchValue = valueSearch.value.trim();
        if(searchValue !== ''){
            searchWeather(searchValue);
        }
    });

    const searchWeather = (cityName) => {
        // إظهار حالة التحميل
        main.classList.add('loading');
        
        fetch(baseUrl + id + '&q=' + encodeURIComponent(cityName))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                
                if(data.cod === 200){
                    // تحديث اسم المدينة والعلم
                    if (city) {
                        const figcaption = city.querySelector('figcaption');
                        const flagImg = city.querySelector('img');
                        if (figcaption) figcaption.textContent = data.name;
                        if (flagImg) {
                            flagImg.src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                            flagImg.alt = `علم ${data.sys.country}`;
                        }
                    }
                    
                    // تحديث درجة الحرارة والأيقونة
                    if (temperature) {
                        const tempImg = temperature.querySelector('img');
                        const tempSpan = temperature.querySelector('span');
                        if (tempImg) {
                            tempImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                            tempImg.alt = data.weather[0].description;
                        }
                        if (tempSpan) {
                            tempSpan.textContent = Math.round(data.main.temp);
                        }
                    }
                    
                    // تحديث الوصف
                    if (description) {
                        description.textContent = data.weather[0].description;
                    }
                    
                    // تحديث التفاصيل
                    if (clouds) clouds.textContent = data.clouds.all + '%';
                    if (humidity) humidity.textContent = data.main.humidity + '%';
                    if (pressure) pressure.textContent = data.main.pressure + ' hPa';
                    
                    // إزالة رسالة الخطأ إذا كانت موجودة
                    main.classList.remove('error');
                } else {
                    throw new Error(data.message || 'City not found');
                }
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                main.classList.add('error');
                
                // إظهار رسالة الخطأ لفترة أطول
                setTimeout(() => {
                    main.classList.remove('error');
                }, 3000);
            })
            .finally(() => {
                // إزالة حالة التحميل
                main.classList.remove('loading');
                valueSearch.value = '';
            });
    }

    // البحث الافتراضي
    const initApp = () => {
        if (valueSearch) {
            valueSearch.value = 'London';
            searchWeather('London');
        }
    }

    initApp();
});