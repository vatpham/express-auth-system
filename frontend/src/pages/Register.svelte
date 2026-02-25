<script>
  let username = '';
  let password = '';

  async function handleRegister() {
    if (!username || !password) {
      alert('Username and password required');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } else {
      alert(data.error || 'Registration failed');
    }
  }
</script>

<div>
  <h1>Register</h1>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="button" on:click={handleRegister}>Register</button>
  <div>
    <a href="/login">Already have an account?</a>
  </div>
</div>

