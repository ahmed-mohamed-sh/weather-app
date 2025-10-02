let id = '9505fd1df737e20152fbd78cdb289b6a';
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id;

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

    form.addEventListener("submit", (e) => {
        e.preventDefault();  
        if(valueSearch.value.trim() != ''){
            searchWeather();
        }
    });

    const searchWeather = () => {
        fetch(baseUrl + '&q=' + encodeURIComponent(valueSearch.value))
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.cod == 200){
                    // تحديث اسم المدينة والعلم
                    city.querySelector('figcaption').innerHTML = data.name;
                    city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                    
                    // تحديث درجة الحرارة والأيقونة
                    temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                    temperature.querySelector('span').innerText = Math.round(data.main.temp);
                    
                    // تحديث الوصف
                    description.innerText = data.weather[0].description;

                    // تحديث التفاصيل
                    clouds.innerText = data.clouds.all;
                    humidity.innerText = data.main.humidity;
                    pressure.innerText = data.main.pressure;
                    
                    // إزالة الخطأ إذا كان موجوداً
                    if(main.classList.contains('error')) {
                        main.classList.remove('error');
                    }
                } else {
                    // إظهار الخطأ
                    main.classList.add('error');
                    setTimeout(() => {
                        main.classList.remove('error');
                    }, 3000);
                }
                valueSearch.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                main.classList.add('error');
                setTimeout(() => {
                    main.classList.remove('error');
                }, 3000);
            });
    }

    // بحث افتراضي
    const initApp = () => {
        valueSearch.value = 'London';
        searchWeather();
    }
    
    initApp();
});