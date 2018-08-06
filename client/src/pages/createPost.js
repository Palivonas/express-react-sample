import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			content: '',
			loading: false,
			error: false,
		};
		this.redirect = (to) => props.history.push(to);
	}
	componentDidMount() {
		if (!api.isAuthenticated()) {
			this.redirect('/login');
		}
	}
	async submit() {
		this.setState({ loading: true, error: false });
		try {
			const post = await api.posts.create({
				title: this.state.title,
				content: this.state.content,
			});
			this.redirect(`/posts/${encodeURIComponent(post.id)}`);
		} catch (err) {
			this.setState({ error: true, loading: false });
		}
	}
	render() {
		return (
			<form onSubmit={ (e) => { e.preventDefault(); this.submit(); } }>
				<section>
					<input
						onChange={ (event) => this.setState({ title: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Post title"
						required
					/>
				</section>
				<section>
					<textarea
						onChange={ (event) => this.setState({ content: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Post content"
						rows="15"
						required
					/>
				</section>
				<section>
					<button type="submit" disabled={ this.state.loading }>
						{ this.state.loading ? 'Please wait...' : 'Publish!'}
					</button>
				</section>
				{ this.state.error &&
					<section>
						<p>Stuff went wrong.</p>
					</section>
				}
			</form>
		);
	}
}

CreatePost.propTypes = {
	history: PropTypes.object.isRequired,
};

export default CreatePost;
