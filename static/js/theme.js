// Проверяем системные настройки темы
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Функция для установки темы
function setTheme(isDark) {
    const icon = document.querySelector('.theme-toggle i');
    if (isDark) {
        document.body.classList.remove('light-theme');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    } else {
        document.body.classList.add('light-theme');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// Устанавливаем начальную тему на основе системных настроек
document.addEventListener('DOMContentLoaded', function() {
    // Используем системную тему по умолчанию
    setTheme(prefersDarkScheme.matches);
    
    // Слушаем изменения системной темы
    prefersDarkScheme.addEventListener('change', (e) => {
        setTheme(e.matches);
    });
    
    // Обработчик клика по кнопке
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('light-theme');
            setTheme(!isDark);
        });
    }
});