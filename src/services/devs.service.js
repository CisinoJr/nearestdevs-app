import axios from "axios";

const api = axios.create({
  baseURL: 'https://nearestdevs-api.herokuapp.com/api',
  headers: {
    Accept: 'application/json',
  },
});

export default class DevsService {

  async createDev(dev) {
    const response = await api.post('/devs', dev);

    return response.data;
  }

  async getAllDevs() {
    const response = await api.get('/devs');

    return response.data;
  }

  async search(filter) {
    try {
      const response = await api.get('/search', { params: filter })
        .catch(error => { throw error; });
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

}
