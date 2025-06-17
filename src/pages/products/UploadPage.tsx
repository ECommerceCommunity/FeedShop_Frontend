import { useState, FC, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${(props) => props.theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const ProductUploadPage: FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    images: [] as File[],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Container>
      <Title>상품 등록</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">상품명</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">가격</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">카테고리</Label>
          <Input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">상품 설명</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="images">상품 이미지</Label>
          <Input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            required
          />
        </FormGroup>

        <Button type="submit">상품 등록하기</Button>
      </Form>
    </Container>
  );
};

export default ProductUploadPage;
