const Axios = require('axios');

const axios = Axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api',
});

const storage = window.localStorage; // abstract for easier SSR implementation later

axios.interceptors.response.use((response) => response, (error) => {
	if (error.response.status === 401 && error.response.data.error === 'token_invalid') {
		storage.removeItem('token');
		window.location.assign('/');
	}
	throw error;
});

const setToken = (token) => {
	storage.setItem('token', token);
	axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const checkTokenStorage = () => {
	const token = storage.getItem('token');
	if (token) {
		setToken(token);
	}
};

const cache = {
	posts: new Map(),
};

const api = {
	posts: {
		async find() {
			const posts = (await axios.get('/posts')).data;
			posts.forEach((post) => cache.posts.set(post.id, post));
			return posts;
		},
		async get(id) {
			let post = cache.posts.get(id);
			if (!post) {
				post = (await axios.get(`/posts/${encodeURIComponent(id)}`)).data;
				cache.posts.set(post.id, post);
			}
			return post;
		},
		async create(data) {
			const post = (await axios.post('/posts', data)).data;
			cache.posts.set(post.id, post);
			return post;
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
	},
	auth: {
		async create(credentials) {
			const { token } = (await axios.post('/auth', credentials)).data;
			setToken(token);
			return token;
		},
	},
	checkTokenStorage,
};

export default api;
