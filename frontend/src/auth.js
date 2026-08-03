export function initAuthFlow() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://crypto-qifp.onrender.com';
  const loginButtons = document.querySelectorAll('[data-google-login]');
  const status = document.getElementById('auth-status');
  const params = new URLSearchParams(window.location.search);

  loginButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (status) status.textContent = 'Redirecting to Google...';
      window.location.href = `${backendUrl}/login`;
    });
  });

  if (params.get('auth') === 'success' && status) {
    const name = params.get('name') || 'Google user';
    const email = params.get('email');
    status.textContent = `Authorized as ${name}${email ? ` (${email})` : ''}`;
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (params.get('auth') === 'error' && status) {
    status.textContent = `Authorization failed: ${params.get('message') || 'unknown error'}`;
    window.history.replaceState({}, '', window.location.pathname);
  }
}
