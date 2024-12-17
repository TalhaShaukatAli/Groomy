<script>
  import { page } from '$lib/stores.svelte';

  page.set('Home');
</script>

<div class="container">
  <h1>Welcome to Grommy</h1>
  <p class="tagline">Your Pet Grooming Dashboard</p>
  
  <div class="main-content">
    <p>Welcome to your grooming management hub! Here you can:</p>
    <ul>
      <li>Manage your appointments</li>
      <li>Track client information</li>
      <li>Handle invoices</li>
      <li>View your daily schedule</li>
    </ul>
  </div>
</div>

<style>

  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .tagline {
    font-size: 1.25rem;
    color: #7f8c8d;
    margin-bottom: 2rem;
  }

  .main-content {
    margin-bottom: 2rem;
  }

  .main-content p {
    font-size: 1.1rem;
    color: #34495e;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 1.1rem;
    color: #34495e;
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
  }

  li:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #3498db;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .action-button {
    background-color: #3498db;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .action-button:hover {
    background-color: #2980b9;
  }
</style>
