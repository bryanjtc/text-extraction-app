import axios from 'axios';

const fetchEnv = async () => {
  const response = await axios.get(`https://us-central1-text-extraction-app.cloudfunctions.net/getEnv`);
  return response.data;
};

const env = await fetchEnv();

const config = {
  azureKey: env.azure.key,
  firebaseKey: env.config_api.key,
};

export default config;
