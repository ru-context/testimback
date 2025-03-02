document.addEventListener('DOMContentLoaded', function() {
    const bookCallBtn = document.querySelector('.book-call-btn');
    const contentWrapper = document.querySelector('.content-wrapper');
    const inputFormWrapper = document.querySelector('.input-form-wrapper');
    const mlInput = document.querySelector('.ml-input');
    
    bookCallBtn.addEventListener('click', function() {
        // Добавляем класс для анимации исчезновения
        contentWrapper.classList.add('fade-out');
        
        // Ждем окончания анимации перед скрытием
        contentWrapper.addEventListener('animationend', function handler() {
            contentWrapper.classList.add('hidden');
            inputFormWrapper.classList.remove('hidden');
            inputFormWrapper.classList.add('visible');
            mlInput.focus();
            
            // Удаляем обработчик после первого срабатывания
            contentWrapper.removeEventListener('animationend', handler);
        });
    });
    
    // Обработка нажатия клавиш в текстовом поле
    mlInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            const userPrompt = mlInput.value.trim();
            if (userPrompt) {
                console.log('Sending prompt to ML model:', userPrompt);
                mlInput.value = '';
                
                inputFormWrapper.classList.remove('visible');
                setTimeout(() => {
                    inputFormWrapper.classList.add('hidden');
                    contentWrapper.classList.remove('hidden');
                    contentWrapper.classList.remove('fade-out');
                    // Запускаем анимацию появления контента
                    contentWrapper.style.animation = 'fadeInUp 0.8s ease forwards';
                }, 800);
            }
        }
    });
});