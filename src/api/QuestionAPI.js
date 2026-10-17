import axios from 'axios';
import mockAdapter from './mockAdapter';

// No backend: requests are served from the local JSON data (see ./mockAdapter).
export default axios.create({
    adapter: mockAdapter
});
