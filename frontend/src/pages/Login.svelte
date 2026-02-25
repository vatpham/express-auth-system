<script>
  import { onMount } from 'svelte';

  let username = '';
  let password = '';

  onMount(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/dashboard';
    }
  });

  async function handleLogin() {
    if (!username || !password) {
      alert('Username and password required');
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      alert('Login failed');
    }
  }
</script>

<div>
  <h1>Login</h1>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="button" on:click={handleLogin}>Login</button>
  <div>
    <a href="/register">Don't have an account?</a>
  </div>
</div>

