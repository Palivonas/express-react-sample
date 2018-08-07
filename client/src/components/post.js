import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import marked from 'marked';
import 'github-markdown-css';

import './post.css';

const getHtml = (md) => {
	const __html = marked(md, { sanitize: true, breaks: true });
	return { __html };
};

const Post = ({ post }) => (
	<article className="post" key={post.id}>
		<h2><Link to={`/posts/${post.id}`}>{ post.title }</Link></h2>
		<small>Published { new Date(post.createdAt).toLocaleString() } by author#{ post.authorId }</small>
		<div className="markdown-body" dangerouslySetInnerHTML={getHtml(post.content)} />
	</article>
);

Post.propTypes = {
	post: PropTypes.object.isRequired,
	truncate: PropTypes.bool,
};

export default Post;
