import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './App.css';

import PostList from './pages/postList';
import SinglePost from './pages/singlePost';
import Login from './pages/login';
import Register from './pages/register';
import CreatePost from './pages/createPost';

class App extends Component {
	render() {
		return (
			<div>
				<h1 className="site-title"><Link to="/"><em>The</em> Blog</Link></h1>

				<header className="navigation">
					<Link to="/">Home</Link>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
					<Link to="/create">New post</Link>
				</header>
				<Switch>
					<Route exact path="/" component={PostList} />
					<Route path="/posts/:id" component={SinglePost} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<Route path="/create" component={CreatePost} />
				</Switch>
			</div>
		);
	}
}

export default App;
