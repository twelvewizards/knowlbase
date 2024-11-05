document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const overlay = document.getElementById('overlay');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const openSignupLink = document.querySelector('.open-signup-modal');
    const openLoginLink = document.querySelector('.open-login-modal');

    // Open Login Modal
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        overlay.style.display = 'block';
        loginModal.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            loginModal.style.opacity = '1';
            loginModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    });

    // Open Sign-Up Modal
    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        overlay.style.display = 'block';
        signupModal.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            signupModal.style.opacity = '1';
            signupModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    });

    // Link from Login to Sign-Up Modal
    openSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.opacity = '0';
        loginModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
            setTimeout(() => {
                signupModal.style.opacity = '1';
                signupModal.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);
        }, 300);
    });

    // Link from Sign-Up to Login Modal
    openLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.opacity = '0';
        signupModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
            setTimeout(() => {
                loginModal.style.opacity = '1';
                loginModal.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);
        }, 300);
    });

    // Close modals when overlay is clicked
    overlay.addEventListener('click', function() {
        overlay.style.opacity = '0';
        loginModal.style.opacity = '0';
        signupModal.style.opacity = '0';
        loginModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        signupModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            overlay.style.display = 'none';
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        }, 300);
    });
});
