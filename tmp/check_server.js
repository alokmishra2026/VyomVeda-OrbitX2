async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/');
    console.log('Server status:', response.status);
    console.log('Server headers:', [...response.headers.entries()]);
  } catch (err) {
    console.error('Server check failed:', err.message);
  }
}

checkServer();
