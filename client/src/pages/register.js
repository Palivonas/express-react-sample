import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { view } from 'react-easy-state';
import api from '../api';
import store from '../store';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			loading: false,
			error: false,
		};
	}
	async submit() {
		this.setState({ loading: true, error: false });
		try {
			const { name, email, password } = this.state;
			await api.users.create({ name, email, password });
			await store.authenticate({ email, password });
		} catch (err) {
			this.setState({ error: true, loading: false });
		}
	}
	render() {
		return (
			<form onSubmit={ (e) => { e.preventDefault(); this.submit(); } }>
				{ store.user && <Redirect to="/" />}
				<section>
					<input
						onChange={ (event) => this.setState({ email: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Email"
						type="email"
						required
						autoFocus
					/>
				</section>
				<section>
					<input
						onChange={ (event) => this.setState({ name: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Name"
						required
					/>
				</section>
				<section>
					<input
						onChange={ (event) => this.setState({ password: event.target.value }) }
						disabled={ this.state.loading }
						placeholder="Password"
						type="password"
						required
					/>
				</section>
				<section>
					<button type="submit" disabled={ this.state.loading }>
						{ this.state.loading ? 'Please wait...' : 'Register'}
					</button>
				</section>
				{ this.state.error &&
					<section>
						<p>Duplicate email :( Or some other problem, but this is a very optimistic error handler.</p>
					</section>
				}
			</form>
		);
	}
}

export default view(Login);
