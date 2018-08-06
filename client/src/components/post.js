import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './post.css';

const Post = ({ post }) => (
	<article className="post" key={post.id}>
		<h2><Link to={`/posts/${post.id}`}>{ post.title }</Link></h2>
		<div className="content-text">
			<p>{ post.content }</p>
		</div>
	</article>
);

Post.propTypes = {
	post: PropTypes.object.isRequired,
	truncate: PropTypes.bool,
};

export default Post;
