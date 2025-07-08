import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface StarButtonProps {
  $active: boolean;
}

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: #f9fafb;
`;

const Container = styled.div`
  width: 100%;
  max-width: 960px;
  padding: 2rem;
  background-color: #f9fafb;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Required = styled.span`
  color: red;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: #fff;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const UploadBox = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  background-color: #fff;
  cursor: pointer;
`;

const StarButton = styled.button<StarButtonProps>`
  font-size: 1.5rem;
  color: ${props => (props.$active ? '#facc15' : '#d1d5db')};
  background: none;
  border: none;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #87ceeb;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #60b5d6;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const EvaluationTitle = styled.span`
  font-weight: 600;
`;

const EvaluationScale = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  justify-content: space-around;
`;

const OptionCircle = styled.label<{ checked: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  cursor: pointer;

  input {
    display: none;
  }

  .circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${props => (props.checked ? '#60a5fa' : '#d1d5db')};
    background-color: ${props => (props.checked ? '#60a5fa' : '#fff')};
    color: ${props => (props.checked ? 'white' : '#374151')};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
`;

const Box = styled.div`
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
`;

const options = [1, 2, 3, 4, 5];

const productMetrics = [
  {
    key: 'size',
    title: '사이즈',
    labels: ['매우 작음', '작음', '보통', '널널함', '엄청 큼'],
    guide: '1: 매우 작음 ~ 5: 매우 큼',
  },
  {
    key: 'cushion',
    title: '쿠션감',
    labels: ['매우 약함', '약함', '보통', '푹신함', '매우 푹신함'],
    guide: '1: 매우 약함 ~ 5: 매우 강함',
  },
  {
    key: 'support',
    title: '안정성',
    labels: ['매우 약함', '약함', '보통', '강함', '매우 강함'],
    guide: '1: 매우 약함 ~ 5: 매우 강함',
  },
];

const ReviewEditPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [productEval, setProductEval] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['샌들/슬리퍼', '스니커즈', '스포츠화'];
  

  const handleRating = (value: number) => setRating(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(previews);
    }
  };

  const handlePointToggle = (point: string) => {
    setSelectedPoints(prev =>
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const handleProductEvalChange = (key: string, value: number) => {
    setProductEval(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log({ rating, title, content, category, selectedPoints, productEval });
    alert('리뷰가 저장되었습니다!');
  };

  return (
    <OuterWrapper>
      <Container>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>리뷰 작성</h2>

        <Section>
          <Label>카테고리<Required>*</Required></Label>
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">선택하세요</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </Section>

        <Section>
          <Label>사용자 체형 정보</Label>
          <Box>
            <p>발 사이즈: 270mm</p>
            <p>발볼 넓이: 넓음</p>
          </Box>
        </Section>

        <Section>
          <Label>구매 상품 정보</Label>
          <Box>
            <p>구매 사이즈: 275mm</p>
          </Box>
        </Section>

        <Section>
          <Label>리뷰 제목<Required>*</Required></Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </Section>

        <Section>
          <Label>평점<Required>*</Required></Label>
          {[1, 2, 3, 4, 5].map(star => (
            <StarButton
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              $active={star <= (hoverRating || rating)}
            >
              ★
            </StarButton>
          ))}
        </Section>

        <Section>
          <Label>상품 평가<Required>*</Required></Label>
          {productMetrics.map(metric => (
            <Section key={metric.key}>
              <TitleRow>
                <EvaluationTitle>{metric.title}</EvaluationTitle>
                <EvaluationScale>{metric.guide}</EvaluationScale>
              </TitleRow>
              <OptionRow>
                <LabelWrapper>
                  {options.map((opt, idx) => (
                    <OptionCircle key={opt} checked={productEval[metric.key] === opt}>
                      <input
                        type="radio"
                        name={metric.key}
                        value={opt}
                        onChange={() => handleProductEvalChange(metric.key, opt)}
                      />
                      <div className="circle">{opt}</div>
                      <span>{metric.labels[idx]}</span>
                    </OptionCircle>
                  ))}
                </LabelWrapper>
              </OptionRow>
            </Section>
          ))}
        </Section>

        

        <Section>
          <Label>상세설명 내용<Required>*</Required></Label>
          <Textarea
            rows={5}
            maxLength={2000}
            value={content}
            placeholder="리뷰 내용을 입력해주세요"
            onChange={e => setContent(e.target.value)}
          />
          <CharCount>{content.length} / 2000자</CharCount>
        </Section>

        <Section>
          <Label>이미지 업로드 (최대 10장)</Label>
          <UploadBox onClick={() => fileInputRef.current?.click()}>
            <div style={{ fontSize: '2rem' }}>📤</div>
            <div>이미지를 드래그하거나 클릭하여 업로드하세요</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>지원형식 : JPG, PNG, GIF (최대 5MB)</div>
          </UploadBox>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <ImagePreview>
            {previews.map((src, i) => (
              <PreviewItem key={i}><img src={src} alt={`preview-${i}`} /></PreviewItem>
            ))}
          </ImagePreview>
        </Section>

        <Button onClick={handleSubmit}>저장하기</Button>
      </Container>
    </OuterWrapper>
  );
};

export default ReviewEditPage;