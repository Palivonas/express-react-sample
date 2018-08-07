import React, { Component } from 'react';
import { view } from 'react-easy-state';
import { Redirect } from 'react-router-dom';
import store from '../store';

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			content: '',
			loading: false,
			error: false,
			post: null,
		};
	}
	async submit() {
		this.setState({ loading: true, error: false });
		try {
			const post = await store.createPost({
				title: this.state.title,
				content: this.state.content,
			});
			this.setState({ post });
		} catch (err) {
			this.setState({ error: true, loading: false });
		}
	}
	render() {
		return (
			<form onSubmit={ (e) => { e.preventDefault(); this.submit(); } }>
				{ !store.user && <Redirect to="/" />}
				{ this.state.post && <Redirect to={ `/posts/${encodeURIComponent(this.state.post.id)}` } />}
				<section>
					<input
						onChange={ (event) => this.setState({ title: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Post title"
						required
					/>
				</section>
				<section>
					<small>Markdown is supported</small>
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

export default view(CreatePost);
