import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const posts = [
  { id: 1, title: "첫 번째 게시글", createdAt: "2023-10-27" },
  { id: 2, title: "두 번째 게시글", createdAt: "2023-10-26" },
];

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  a {
    text-decoration: none;
    color: white;
    font-weight: 500;
  }
`;

const MyPosts = () => {
  return (
    <Container>
      <Title>내가 작성한 게시글</Title>
      <PostList>
        {posts.map((post) => (
          <PostItem key={post.id}>
            <Link to={`/feed/${post.id}`}>{post.title}</Link>
            <div>{post.createdAt}</div>
          </PostItem>
        ))}
      </PostList>
    </Container>
  );
};

export default MyPosts;
