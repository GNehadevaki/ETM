function validateAndShowNext() {
    const regNoInput = document.getElementById('regNo');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nextInput = document.getElementById('dob');

    if (validateRegistrationNumber(regNoInput.value) && passwordInput.value === confirmPasswordInput.value) {
        regNoInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        confirmPasswordInput.classList.remove('invalid');
        regNoInput.style.opacity = '0';
        passwordInput.style.opacity = '0';
        confirmPasswordInput.style.opacity = '0';
        nextInput.style.opacity = '1';
        nextInput.focus();
    } else {
        regNoInput.classList.add('invalid');
        passwordInput.classList.add('invalid');
        confirmPasswordInput.classList.add('invalid');
        alert('Invalid registration number format or passwords do not match.');
    }
}

function validateRegistrationNumber(input) {
    // Regular expression for the desired format: av.en.u4cse22129
    const regex = /^[a-z]{2}\.[a-z]{2}\.[a-z]{1}[0-9]{1}[a-z]{3}[0-9]{5}$/i;
    return regex.test(input);
}