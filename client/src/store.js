import { store } from 'react-easy-state';
import api from './api';

const blogStore = store({
	user: null,
	postsKeyed: {},
	posts: [],
	postsLoaded: false,
	async fetchPosts() {
		const posts = await api.posts.find();
		posts.forEach((post) => blogStore.postsKeyed[post.id] = post);
		blogStore.postsLoaded = true;
		blogStore.updateFromKeyed();
		return blogStore.posts;
	},
	async fetchPost(id) {
		const post = await api.posts.get(id);
		blogStore.postsKeyed[post.id] = post;
		blogStore.updateFromKeyed();
		return post;
	},
	async createPost(data) {
		const post = await api.posts.create(data);
		blogStore.postsKeyed[post.id] = post;
		blogStore.updateFromKeyed();
		return post;
	},
	updateFromKeyed() {
		blogStore.posts = Object.values(blogStore.postsKeyed)
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	},

	async authenticate(credentials) {
		window.s = blogStore;
		if (!credentials) {
			api.checkTokenStorage();
			if (!api.isAuthenticated) {
				return;
			}
		} else {
			await api.auth.create(credentials);
		}
		blogStore.user = await api.users.getAuthenticated();
	},
	logout() {
		api.auth.logout();
		blogStore.user = null;
	}
});

export default blogStore;
