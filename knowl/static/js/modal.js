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
        openLoginModal();
    });

    // Open Sign-Up Modal
    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSignupModal();
    });

    // Link from Login to Sign-Up Modal
    openSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        closeLoginModal();
        setTimeout(() => {
            openSignupModal();
        }, 300);
    });

    // Link from Sign-Up to Login Modal
    openLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        closeSignupModal();
        setTimeout(() => {
            openLoginModal();
        }, 300);
    });

    // Close modals when overlay is clicked
    overlay.addEventListener('click', function() {
        closeLoginModal();
        closeSignupModal();
    });

    // Functions to open and close modals
    function openLoginModal() {
        overlay.style.display = 'block';
        loginModal.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            loginModal.style.opacity = '1';
            loginModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }

    function closeLoginModal() {
        overlay.style.opacity = '0';
        loginModal.style.opacity = '0';
        loginModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            overlay.style.display = 'none';
            loginModal.style.display = 'none';
        }, 300);
    }

    function openSignupModal() {
        overlay.style.display = 'block';
        signupModal.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
            signupModal.style.opacity = '1';
            signupModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }

    function closeSignupModal() {
        overlay.style.opacity = '0';
        signupModal.style.opacity = '0';
        signupModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
            overlay.style.display = 'none';
            signupModal.style.display = 'none';
        }, 300);
    }

    // Open modals based on server-side variables
    if (typeof showLoginModal !== 'undefined' && showLoginModal) {
        openLoginModal();
    }

    if (typeof showSignupModal !== 'undefined' && showSignupModal) {
        openSignupModal();
    }
});
