const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const alertBox = document.getElementById('alertBox');
const alertIcon = document.getElementById('alertIcon');
const alertMessage = document.getElementById('alertMessage');
const emailInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const LOGIN_ENDPOINT = '/api/login';
const SESSION_KEY = 'aiCompassUser';

function showAlert(message, type = 'success') {
  alertMessage.textContent = message;
  alertBox.classList.remove(
    'hidden',
    'opacity-0',
    'bg-emerald-500/10',
    'text-emerald-400',
    'border-emerald-500/20',
    'bg-rose-500/10',
    'text-rose-400',
    'border-rose-500/20'
  );
  alertBox.classList.add('flex', 'border');

  if (type === 'success') {
    alertIcon.textContent = 'check_circle';
    alertBox.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20');
  } else {
    alertIcon.textContent = 'warning';
    alertBox.classList.add('bg-rose-500/10', 'text-rose-400', 'border-rose-500/20');
  }
}

function setFormLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    btnText.textContent = 'Authenticating...';
    btnIcon.textContent = 'progress_activity';
    btnIcon.classList.add('spinner');
    submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
    return;
  }

  submitBtn.disabled = false;
  btnText.textContent = 'Sign In Securely';
  btnIcon.textContent = 'arrow_forward';
  btnIcon.classList.remove('spinner');
  submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
}

async function handleLogin(event) {
  event.preventDefault();
  setFormLoading(true);
  alertBox.classList.add('hidden', 'opacity-0');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const rawBody = await response.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch (parseError) {
      console.error('Login response parse error:', parseError, rawBody);
      data = {
        success: false,
        message: rawBody && !rawBody.trim().startsWith('<')
          ? rawBody
          : 'The server returned an invalid response. Restart Netlify dev and try again.'
      };
    }

    setFormLoading(false);

    if (!response.ok || !data.success) {
      const errorMsg = data.message || 'Invalid email or password.';
      showAlert(errorMsg, 'error');
      console.error('Login Error Details:', data);
      passwordInput.value = '';
      loginForm.classList.add('animate-[shake_0.4s_ease-in-out]');
      setTimeout(() => {
        loginForm.classList.remove('animate-[shake_0.4s_ease-in-out]');
      }, 400);
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    showAlert(data.message || 'Login successful. Redirecting...', 'success');
    
    // Save login state
    localStorage.setItem('userEmail', email);
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } catch (error) {
    console.error('Login request failed:', error);
    setFormLoading(false);
    showAlert('Network error: could not connect to the backend.', 'error');
  }
}

if (loginForm && submitBtn && alertBox && alertIcon && alertMessage && emailInput && passwordInput) {
  const savedSession = localStorage.getItem(SESSION_KEY);
  if (savedSession) {
    window.location.href = 'index.html';
  }
  loginForm.addEventListener('submit', handleLogin);
} else {
  console.error('Login form elements are missing. Check login.html IDs.');
}

const style = document.createElement('style');
style.innerHTML = '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }';
document.head.appendChild(style);
