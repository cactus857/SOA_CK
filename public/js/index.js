/* eslint-disable */

// Import only modules that exist
// Remove problematic imports temporarily
// import { displayMap } from './mapbox';
// import { login, logout } from './login';
// import { bookTour } from './stripe';
// import { updateUserData, updatePassword } from './updateSettings';
// import { showAlert } from './alerts';

// Only run on browser, not on Node.js
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    // DELEGATION
    // Map
    const mapElement = document.getElementById('map');
    if (mapElement)
        mapElement.addEventListener('load', () => {
            displayMap(JSON.parse(mapElement.dataset.locations));
        });

    // Login form
    const loginForm = document.querySelector('.form--login');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    // Logout button
    const logOutBtn = document.querySelector('.nav__el--logout');
    if (logOutBtn) logOutBtn.addEventListener('click', logout);

    // User data form
    const userDataForm = document.querySelector('.form-user-data');
    if (userDataForm) {
        userDataForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = new FormData();
            form.append('name', document.getElementById('name').value);
            form.append('email', document.getElementById('email').value);
            form.append('photo', document.getElementById('photo').files[0]);

            updateUserData(form);
        });
    }

    // User password form
    const userPasswordForm = document.querySelector('.form-user-password');
    if (userPasswordForm) {
        userPasswordForm.addEventListener('submit', async e => {
            e.preventDefault();
            document.querySelector('.save-password').textContent = 'Updating...';

            const passwordCurrent = document.getElementById('password-current').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;
            await updatePassword(passwordCurrent, password, passwordConfirm);

            document.querySelector('.save-password').textContent = 'Save password';
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        });
    }

    // Signup form
    const signupForm = document.querySelector('.form--signup');
    if (signupForm) {
        signupForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;

            // Call signup function (if exists)
            if (typeof window.signup !== 'undefined') {
                window.signup(name, email, password, passwordConfirm);
            }
        });
    }

    // Reset password form
    const resetForm = document.querySelector('.form--reset');
    if (resetForm) {
        resetForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            // Call forgot password function (if exists)
            if (typeof window.forgotPassword !== 'undefined') {
                window.forgotPassword(email);
            }
        });
    }

    // Update password form
    const updatePassForm = document.querySelector('.form--updatePass');
    if (updatePassForm) {
        updatePassForm.addEventListener('submit', async e => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;

            // Call reset password function (if exists)
            if (typeof window.resetPassword !== 'undefined') {
                await window.resetPassword(password, passwordConfirm);
            }
        });
    }

    // Book tour button
    const bookBtn = document.getElementById('book-tour');
    if (bookBtn)
        bookBtn.addEventListener('click', e => {
            e.target.textContent = 'Processing...';
            const { tourId } = e.target.dataset;
            bookTour(tourId);
        });

    // Alerts
    const alert = document.body.dataset.alert;
    if (alert) showAlert('success', alert, 20);
}