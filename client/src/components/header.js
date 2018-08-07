import React from 'react';
import { Link } from 'react-router-dom';
import { view } from 'react-easy-state';
import store from '../store';

const Header = () => (
	<header className="navigation">
		<Link to="/">Home</Link>
		{ store.user && <Link to="/create">New post</Link> }
		{ store.user && <a onClick={ store.logout }>Logout</a> }
		{ !store.user && <Link to="/login">Login</Link> }
		{ !store.user && <Link to="/register">Register</Link> }
	</header>
);

export default view(Header);
