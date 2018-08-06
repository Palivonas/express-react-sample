import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			content: '',
		};
		this.redirect = (to) => props.history.push(to);
	}
	async submit() {
		const post = await api.posts.create({
			title: this.state.title,
			content: this.state.content,
		});
		this.redirect(`/posts/${encodeURIComponent(post.id)}`);
	}
	render() {
		return (
			<form onSubmit={ (e) => { e.preventDefault(); this.submit(); } }>
				<section>
					<input
						onChange={ (event) => this.setState({ title: event.target.value }) }
						placeholder="Post title"
						required
					/>
				</section>
				<section>
					<textarea
						onChange={ (event) => this.setState({ content: event.target.value }) }
						placeholder="Post content"
						rows="15"
						required
					/>
				</section>
				<section>
					<button type="submit">Publish!</button>
				</section>
			</form>
		);
	}
}

CreatePost.propTypes = {
	history: PropTypes.object.isRequired,
};

export default CreatePost;
