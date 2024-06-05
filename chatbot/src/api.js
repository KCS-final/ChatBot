import axios from 'axios';

export const fetchItems = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/no-auth/chatBot`);
  return response.data;
};
