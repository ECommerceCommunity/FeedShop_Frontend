import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AddressRequest, AddressResponse } from "../../types/types";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressRequest) => void;
  editingAddress?: AddressResponse | null;
  isLoading?: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1f2937;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
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
  font-weight: 500;
  color: #d1d5db;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #f97316;
    background: rgba(0, 0, 0, 0.4);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #f97316;
`;

const CheckboxLabel = styled.label`
  color: #d1d5db;
  font-size: 0.9rem;
  cursor: pointer;
`;

const AddressSearchGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const SearchButton = styled.button`
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #ea580c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #f97316;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #ea580c;
    }
    
    &:disabled {
      background: #6b7280;
      cursor: not-allowed;
    }
  `
      : `
    background: transparent;
    color: #9ca3af;
    border: 1px solid #374151;
    
    &:hover {
      color: white;
      border-color: #6b7280;
    }
  `}
`;

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAddress,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AddressRequest>({
    recipientName: "",
    recipientPhone: "",
    zipCode: "",
    addressLine1: "",
    addressLine2: "",
    isDefault: false,
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        recipientName: editingAddress.recipientName,
        recipientPhone: editingAddress.recipientPhone,
        zipCode: editingAddress.zipCode,
        addressLine1: editingAddress.addressLine1,
        addressLine2: editingAddress.addressLine2 || "",
        isDefault: editingAddress.isDefault,
      });
    } else {
      setFormData({
        recipientName: "",
        recipientPhone: "",
        zipCode: "",
        addressLine1: "",
        addressLine2: "",
        isDefault: false,
      });
    }
  }, [editingAddress, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 다음 주소 검색 API
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          setFormData((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            addressLine1: data.address,
          }));
          // 상세주소 입력 필드에 포커스
          const addressLine2Input = document.getElementById("addressLine2");
          if (addressLine2Input) {
            addressLine2Input.focus();
          }
        },
        onclose: function () {
          // 주소 검색 창이 닫힐 때 실행할 코드 (필요시)
        },
      }).open();
    } else {
      alert("주소 검색 서비스를 사용할 수 없습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{editingAddress ? "배송지 수정" : "새 배송지 추가"}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="recipientName">받는 분 *</Label>
            <Input
              id="recipientName"
              name="recipientName"
              type="text"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="받는 분 이름을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recipientPhone">연락처 *</Label>
            <Input
              id="recipientPhone"
              name="recipientPhone"
              type="tel"
              value={formData.recipientPhone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="zipCode">우편번호 *</Label>
            <AddressSearchGroup>
              <Input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="우편번호"
                required
                readOnly
              />
              <SearchButton type="button" onClick={handleAddressSearch}>
                주소 검색
              </SearchButton>
            </AddressSearchGroup>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine1">기본 주소 *</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              type="text"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="기본 주소"
              required
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine2">상세 주소</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              type="text"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="상세 주소를 입력하세요 (동, 호수 등)"
            />
          </FormGroup>

          <CheckboxGroup>
            <Checkbox
              id="isDefault"
              name="isDefault"
              type="checkbox"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <CheckboxLabel htmlFor="isDefault">
              기본 배송지로 설정
            </CheckboxLabel>
          </CheckboxGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddressModal;
