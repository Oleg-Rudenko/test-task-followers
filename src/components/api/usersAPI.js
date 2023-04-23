import axios from 'axios';
axios.defaults.baseURL = 'https://64424fbf33997d3ef90cf4f2.mockapi.io/';

export async function fetchUsers() {
  const response = await axios.get('users', {
    params: { page: 1, limit: 3 },
  });
  return response.data;
}

export async function nextPageUsers(page, limit) {
  const response = await axios.get('users', {
    params: { page, limit },
  });
  return response.data;
}
