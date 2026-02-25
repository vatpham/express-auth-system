<script>
  import { onMount } from 'svelte';

  import Home from './pages/Home.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Admin from './pages/Admin.svelte';

  let route = '/';

  onMount(() => {
    if (typeof window !== 'undefined') {
      route = window.location.pathname || '/';
    }
  });
</script>

{#if route === '/login'}
  <Login />
{:else if route === '/register'}
  <Register />
{:else if route === '/dashboard'}
  <Dashboard />
{:else if route === '/admin'}
  <Admin />
{:else}
  <Home />
{/if}
