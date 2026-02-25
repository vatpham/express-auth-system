<script>
  import { onMount } from 'svelte';

  let users = [];

  function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }
    return token;
  }

  async function getUsers() {
    const token = getToken();
    if (!token) return;

    const res = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to fetch users');
      if (res.status === 400 || res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      users = [];
      return;
    }

    users = Array.isArray(data) ? data : [];
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  onMount(() => {
   const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  });
</script>

<div>
  <h1>Dashboard</h1>
  <button type="button" on:click={getUsers}>Load Users</button>
  <button type="button" on:click={logout}>Logout</button>

  <ul>
    {#each users as user}
      <li>{user.username}</li>
    {/each}
  </ul>
</div>

