const Axios = require('axios');

const axios = Axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api',
});

const storage = window.localStorage; // abstract for easier SSR implementation later

let authenticated = false;

const setToken = (token) => {
	storage.setItem('token', token);
	authenticated = true;
	axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearToken = () => {
	storage.removeItem('token');
	authenticated = false;
	delete axios.defaults.headers.common.Authorization;
};

const checkTokenStorage = () => {
	const token = storage.getItem('token');
	if (token) {
		setToken(token);
	}
};

axios.interceptors.response.use((response) => response, (error) => {
	if (error.response.status === 401 && error.response.data.error === 'token_invalid') {
		clearToken();
	}
	throw error;
});

const api = {
	posts: {
		async find() {
			return (await axios.get('/posts')).data;
		},
		async get(id) {
			return (await axios.get(`/posts/${encodeURIComponent(id)}`)).data;
		},
		async create(data) {
			return (await axios.post('/posts', data)).data;
		},
		async delete(id) {
			return (await axios.delete(`/posts/${encodeURIComponent(id)}`)).data;
		},
	},
	users: {
		async create(data) {
			const user = (await axios.post('/users', data)).data;
			return user;
		},
		async getAuthenticated() {
			return (await axios.get('/users/me')).data;
		},
	},
	auth: {
		async create(credentials) {
			const { token } = (await axios.post('/auth', credentials)).data;
			setToken(token);
			return token;
		},
		async logout() {
			clearToken();
		},
	},
	checkTokenStorage,
	get isAuthenticated() {
		return authenticated;
	}
};

export default api;
