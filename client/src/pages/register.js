import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

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
		this.redirect = (to) => props.history.push(to);
	}
	async submit() {
		this.setState({ loading: true, error: false });
		try {
			const { name, email, password } = this.state;
			await api.users.create({ name, email, password });
			await api.auth.create({ email, password });
			this.redirect('/');
		} catch (err) {
			this.setState({ error: true, loading: false });
		}
	}
	render() {
		return (
			<form onSubmit={ (e) => { e.preventDefault(); this.submit(); } }>
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

Login.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Login;
