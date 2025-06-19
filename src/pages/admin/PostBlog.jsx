import React from "react";
const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";
const PostBlog = () => (
  <div>
    <h2>Post Blog</h2>
    <p>Create and manage blog posts here.</p>
  </div>
);
export default PostBlog;