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
                formData[element.name] = element.type === 'checkbox' ? element.checked : element.value;
            }
        }
        surveyData.push(formData);
        LS.setItem('surveyData', JSON.stringify(surveyData));

        // Очищення форми після збереження даних
        form.reset();
        
        // Перенаправлення користувача на головну сторінку
        window.location.href = 'index.html';
    });
});
