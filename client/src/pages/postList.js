import React, { Component } from 'react';
import { view } from 'react-easy-state';
import Post from '../components/post';
import store from '../store';

const truncateContent = (post) => {
	const length = 250;
	if (post.content.length <= length) {
		return post;
	}
	return {
		...post,
		content: `${post.content.slice(0, length - 3)}...`,
	};
};

class PostList extends Component {
	componentDidMount() {
		store.fetchPosts();
	}
	render() {
		return (
			store.postsLoaded
				?
				(store.posts.length === 0 ?
					<h3 className="message">No posts here. How about creating one?</h3>
					:
					store.posts.map(truncateContent).map((post) => (
						<Post post={post} key={post.id} />
					))
				)
				:
				<h3 className="message">Loading posts...</h3>
		);
	}
}

export default view(PostList);
