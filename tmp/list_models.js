async function listModels() {
  const apiKey = 'AIzaSyCBvs_IW8XxkQgafCQ5iLdjn0MW-NvngWg';
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.error(err);
  }
}

listModels();
