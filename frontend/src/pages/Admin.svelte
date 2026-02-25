<script>
  import { onMount } from 'svelte';

  let users = [];
  let currentEditUserId = null;
  let editUsername = '';
  let editRole = 'user';

  function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }
    return token;
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  async function loadAdminUsers() {
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

  function editUser(user) {
    currentEditUserId = user.id;
    editUsername = user.username;
    editRole = user.role || 'user';
  }

  async function saveUser() {
    if (!currentEditUserId) {
      alert('No user selected');
      return;
    }

    if (!editUsername) {
      alert('Username is required');
      return;
    }

    const token = getToken();
    if (!token) return;

    const res = await fetch(`/api/users/${currentEditUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username: editUsername, role: editRole })
    });

    const data = await res.json();

    if (res.ok) {
      alert('User updated successfully');
      await loadAdminUsers();
    } else {
      alert(data.error || 'Failed to update user');
    }
  }

  async function deleteUser(id, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    const token = getToken();
    if (!token) return;

    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert('User deleted successfully');
      await loadAdminUsers();
    } else {
      alert(data.error || data.message || 'Failed to delete user');
    }
  }

  onMount(() => {
    if (getToken()) {
      loadAdminUsers();
    }
  });
</script>

<div>
  <div>
    <h1>Admin Panel</h1>
    <button type="button" on:click={logout}>Logout</button>
  </div>

  <div>
    <h2>Manage Users</h2>
    <button type="button" on:click={loadAdminUsers}>Refresh</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#if users.length === 0}
        <tr>
          <td colspan="4">Loading users...</td>
        </tr>
      {:else}
        {#each users as user}
          <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.role || 'user'}</td>
            <td>
              <button type="button" on:click={() => editUser(user)}>Edit</button>
              <button type="button" on:click={() => deleteUser(user.id, user.username)}>Delete</button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <div>
    <div>
      <h2>Edit User</h2>
      <p>
        {#if currentEditUserId}
          Currently editing ID: {currentEditUserId}
        {:else}
          No user selected
        {/if}
      </p>
    </div>

    <div>
      <label for="editUsername">Username</label>
      <input
        id="editUsername"
        type="text"
        bind:value={editUsername}
        placeholder="Enter username" />
    </div>

    <div>
      <label for="editRole">Role</label>
      <select id="editRole" bind:value={editRole}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <button type="button" on:click={saveUser}>Save Changes</button>
  </div>
</div>

