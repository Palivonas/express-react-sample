import React, { Component } from 'react';
import Post from '../components/post';
import api from '../api';

const truncate = (text, length) => {
	if (text.length <= length) {
		return text;
	}
	return `${text.slice(0, length - 3)}...`;
};

class PostList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			posts: [],
		};
	}
	async componentDidMount() {
		const posts = (await api.posts.find())
			.map((post) => ({
				...post,
				content: truncate(post.content, 250),
			}));
		this.setState({ posts, loaded: true });
	}
	render() {
		return (
			this.state.loaded
				?
				(this.state.posts.length === 0 ?
					<h3 className="message">No posts here. How about creating one?</h3>
					:
					this.state.posts.map((post) => (
						<Post post={post} key={post.id} />
					))
				)
				:
				<h3 className="message">Loading posts...</h3>
		);
	}
}

export default PostList;
