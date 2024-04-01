document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('form');
    const LS = localStorage;

    // Отримання збережених даних з localStorage
    let surveyData = JSON.parse(LS.getItem('surveyData')) || [];

    // Відображення останніх збережених даних у формі
    if (surveyData.length > 0) {
        const lastData = surveyData[surveyData.length - 1];
        for (const key in lastData) {
            const element = form.elements[key];
            if (element) {
                if (element.type === 'checkbox' && lastData[key] === 'on') {
                    element.checked = true;
                } else if (element.type === 'radio') {
                    // Перевірка, чи елемент є радіокнопкою
                    const radioGroup = document.getElementsByName(key);
                    radioGroup.forEach(radio => {
                        if (radio.value === lastData[key]) {
                            radio.checked = true;
                        }
                    });
                } else {
                    element.value = lastData[key];
                }
            }
        }
    }

    // Очищення форми
    form.reset();

    // Обробник події для збереження даних у localStorage при відправці форми
    form.addEventListener('submit', function(event){
        event.preventDefault();

        const formData = {};
        const formElements = form.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.type !== 'submit') {
                if (element.type === 'radio') {
                    // Додавання значення обраної радіокнопки
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                } else {
                    formData[element.name] = element.type === 'checkbox' ? element.checked : element.value;
                }
            }
        }
        surveyData.push(formData);
        LS.setItem('surveyData', JSON.stringify(surveyData));

        // Очищення форми після збереження даних
        form.reset();


    });

    // Виведення результатів за фільтрами при завантаженні сторінки
    document.getElementById('filterByAgeButton').addEventListener('click', function() {
        const filteredByAge = surveyData.filter(item => item.q3 === '1');
        displayResults(filteredByAge, 'Результати за фільтром "Оформлено заказів":');
    });

    document.getElementById('filterByGenderButton').addEventListener('click', function() {
        const filteredByGenderFemale = surveyData.filter(item => item.gender === 'female');
        displayResults(filteredByGenderFemale, 'Результати за фільтром "Жіноча стать":');
    });

    document.getElementById('filterByRatingButton').addEventListener('click', function() {
        const filteredByRating5 = surveyData.filter(item => item.q8 === '5');
        displayResults(filteredByRating5, 'Результати за фільтром "Оцінка 5 балів":');
    });
});

function displayResults(filteredData, filterName) {
    const resultsContainer = document.getElementById('filterResults');
    resultsContainer.innerHTML = ''; // Очищення контейнера перед виведенням нових результатів
    const resultList = document.createElement('ul');
    resultList.innerHTML = `<strong>${filterName}</strong>`;
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = JSON.stringify(item);
            resultList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Немає результатів для відображення за обраним фільтром.';
        resultList.appendChild(listItem);
    }
    resultsContainer.appendChild(resultList);
}
function displayResults(filteredData, filterName) {
    const resultsContainer = document.getElementById('filterResults');
    resultsContainer.innerHTML = ''; // Очищення контейнера перед виведенням нових результатів
    const resultList = document.createElement('div');
    resultList.innerHTML = `<strong>${filterName}</strong>`;
    
    //створення HTML-структури для відображення результатів опитування
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <div><strong>Як ви оцінюєте якість наших продуктів?</strong> ${item.q1}</div>
                <div><strong>Вкажіть вашу дату народження:</strong> ${item.q2}</div>
                <div><strong>Скільки заказів у нас Ви вже зробили?</strong> ${item.q3}</div>
                <div><strong>Що спонукає вас використовувати наш продукт?</strong> ${item.q4}</div>
                <div><strong>Який ваш улюблений продукт серед наших?</strong> ${item.q5}</div>
                <div><strong>Яка ваша стать?</strong> ${item.gender}</div>
                <div><strong>Чи порекомендували б ви наші продукти своїм друзям?</strong> ${item.recommendation ? 'Так' : 'Ні'}</div>
                <div><strong>Яку оцінку ви поставили б нашому сервісу (від 1 до 5)?</strong> ${item.q8}</div>
                <div><strong>Який ваш email (необов'язково)?</strong> ${item.q9}</div>
                <div><strong>Залиште свої додаткові коментарі або пропозиції:</strong> ${item.q10}</div>
            `;
            resultList.appendChild(resultItem);
        });
    } else {
        const noResultsItem = document.createElement('div');
        noResultsItem.textContent = 'Немає результатів для відображення за обраним фільтром.';
        resultList.appendChild(noResultsItem);
    }
    
    resultsContainer.appendChild(resultList);
}


