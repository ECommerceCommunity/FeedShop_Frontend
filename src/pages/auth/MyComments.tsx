import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const comments = [
  { id: 1, content: "정말 좋은 글이네요!", postId: 1, createdAt: "2023-10-27" },
  { id: 2, content: "저도 그렇게 생각해요.", postId: 2, createdAt: "2023-10-26" },
];

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  a {
    text-decoration: none;
    color: white;
  }
`;

const MyComments = () => {
  return (
    <Container>
      <Title>내가 작성한 댓글</Title>
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <Link to={`/feed/${comment.postId}`}>{comment.content}</Link>
            <div>{comment.createdAt}</div>
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
};

export default MyComments;
