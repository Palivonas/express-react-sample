import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Post from '../components/post';
import api from '../api';

class SinglePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.match.params.id,
			post: null,
		};
	}
	async componentDidMount() {
		const post = await api.posts.get(this.state.id);
		this.setState({ post });
	}
	render() {
		return (
			this.state.post
				?
				<Post post={this.state.post} />
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

export default SinglePost;
