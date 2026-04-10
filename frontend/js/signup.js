const signupForm = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const alertBox = document.getElementById('alertBox');
const alertIcon = document.getElementById('alertIcon');
const alertMessage = document.getElementById('alertMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('termsCheckbox');
const termsError = document.getElementById('termsError');

const SIGNUP_ENDPOINT = '/api/signup';

/**
 * Show feedback alert
 */
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
  alertBox.classList.add('flex', 'border', 'opacity-100');

  if (type === 'success') {
    alertIcon.textContent = 'check_circle';
    alertBox.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20');
  } else {
    alertIcon.textContent = 'warning';
    alertBox.classList.add('bg-rose-500/10', 'text-rose-400', 'border-rose-500/20');
  }
}

/**
 * Update UI loading state
 */
function setFormLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    btnText.textContent = 'Creating Account...';
    btnIcon.textContent = 'progress_activity';
    btnIcon.classList.add('spinner');
    submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
    return;
  }

  submitBtn.disabled = false;
  btnText.textContent = 'Create Account';
  btnIcon.textContent = 'person_add';
  btnIcon.classList.remove('spinner');
  submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
}

/**
 * Handle Signup Logic
 */
async function handleSignup(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Basic client-side validation
  if (!termsCheckbox.checked) {
    termsError.classList.remove('hidden');
    return;
  } else {
    termsError.classList.add('hidden');
  }

  if (password !== confirmPassword) {
    showAlert('Passwords do not match.', 'error');
    return;
  }

  if (password.length < 6) {
    showAlert('Password should be at least 6 characters long.', 'error');
    return;
  }

  setFormLoading(true);
  alertBox.classList.add('hidden', 'opacity-0');

  try {
    const response = await fetch(SIGNUP_ENDPOINT, {
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
      data = {
        success: false,
        message: rawBody && !rawBody.trim().startsWith('<')
          ? rawBody
          : 'The server returned an invalid response. Check your backend status.'
      };
    }

    setFormLoading(false);

    if (!response.ok || !data.success) {
      const errorMsg = data.message || 'Signup failed.';
      showAlert(errorMsg, 'error');
      console.error('Signup Error Details:', data);
      return;
    }

    showAlert(data.message || 'Signup successful! Redirecting to login...', 'success');
    
    // Redirect to login after success
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);

  } catch (error) {
    setFormLoading(false);
    showAlert('Network error: could not connect to the server.', 'error');
    console.error('Signup Error:', error);
  }
}

// Attach Event Listeners
if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}
