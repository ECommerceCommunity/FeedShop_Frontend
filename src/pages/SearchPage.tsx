import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.text};
`;

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "상품 1",
      price: 10000,
      image: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      title: "상품 2",
      price: 20000,
      image: "https://via.placeholder.com/200",
    },
    // 더미 데이터
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log("Search:", { searchQuery, category, sortBy });
  };

  return (
    <Container>
      <SearchContainer>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="상품 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>

        <FilterContainer>
          <FilterSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="books">도서</option>
          </FilterSelect>

          <FilterSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">최신순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
          </FilterSelect>
        </FilterContainer>
      </SearchContainer>

      {products.length > 0 ? (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} to={`/products/${product.id}`}>
              <ProductImage src={product.image} alt={product.title} />
              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      ) : (
        <NoResults>검색 결과가 없습니다.</NoResults>
      )}
    </Container>
  );
};

export default SearchPage;
