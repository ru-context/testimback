document.addEventListener('DOMContentLoaded', function() {
    const bookCallBtn = document.querySelector('.book-call-btn');
    const contentWrapper = document.querySelector('.content-wrapper');
    const inputFormWrapper = document.querySelector('.input-form-wrapper');
    const mlInput = document.querySelector('.ml-input');
    
    // Показать форму при нажатии на кнопку
    bookCallBtn.addEventListener('click', function() {
        // Плавно скрываем основной контент с анимацией
        contentWrapper.style.opacity = '0';
        contentWrapper.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            contentWrapper.classList.add('hidden');
            inputFormWrapper.classList.remove('hidden');
            
            // Небольшая задержка перед показом формы для плавности
            setTimeout(() => {
                inputFormWrapper.classList.add('visible');
                mlInput.focus(); // Автоматически фокусируемся на поле ввода
            }, 50);
        }, 800); // Время должно совпадать с transition в CSS
    });
    
    // Обработка нажатия клавиш в текстовом поле
    mlInput.addEventListener('keydown', function(e) {
        // Проверяем, что нажат Enter и не нажат Shift (чтобы можно было делать переносы строк с Shift+Enter)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Предотвращаем добавление новой строки
            
            const userPrompt = mlInput.value.trim();
            if (userPrompt) {
                // Здесь можно добавить логику отправки запроса к модели машинного обучения
                console.log('Sending prompt to ML model:', userPrompt);
                
                // Очистить поле ввода
                mlInput.value = '';
                
                // Возвращаемся к основному контенту с анимацией
                inputFormWrapper.classList.remove('visible');
                
                setTimeout(() => {
                    inputFormWrapper.classList.add('hidden');
                    contentWrapper.classList.remove('hidden');
                    
                    // Небольшая задержка перед показом основного контента
                    setTimeout(() => {
                        contentWrapper.classList.remove('fade-out');
                    }, 50);
                }, 800);
            }
        }
        
        // Добавим возможность вернуться к основному контенту по нажатию Escape
        if (e.key === 'Escape') {
            inputFormWrapper.classList.remove('visible');
            
            setTimeout(() => {
                inputFormWrapper.classList.add('hidden');
                contentWrapper.classList.remove('hidden');
                
                setTimeout(() => {
                    contentWrapper.classList.remove('fade-out');
                }, 50);
            }, 800);
        }
    });
});