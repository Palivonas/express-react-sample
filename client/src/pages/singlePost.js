import React, { Component } from 'react';
import { view } from 'react-easy-state';
import PropTypes from 'prop-types';
import Post from '../components/post';
import store from '../store';

class SinglePost extends Component {
	get postId() {
		return this.props.match.params.id;
	}
	componentDidMount() {
		if (store.postsKeyed[this.postId]) {
			return;
		}
		store.fetchPost(this.postId);
	}
	componentDidUpdate(prevProps) {
		if (this.postId === prevProps.match.params.id) {
			return;
		}
		store.componentDidMount();
	}
	render() {
		return (
			store.postsKeyed[this.postId]
				?
				<Post post={store.postsKeyed[this.postId]} />
				:
				<h3 className="message">Loading post...</h3>
		);
	}
}

SinglePost.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}),
	}),
};

export default view(SinglePost);
