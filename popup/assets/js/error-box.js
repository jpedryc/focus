const errorBox = document.getElementById('error-box');

/**
 * Display error message box
 *
 * @param message Message which should be shown
 */
const showError = (message) => {
    errorBox.innerHTML = '';
    errorBox.innerHTML = '💀' + ' ' + message;
    errorBox.style.display = 'block';
}

/**
 * Hide error message box
 */
const hideError = () =>  { errorBox.style.display = 'none'; }