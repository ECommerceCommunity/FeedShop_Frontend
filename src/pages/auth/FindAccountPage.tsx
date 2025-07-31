import { useState } from "react";
import axios from "axios";
import {
  AuthCard,
  AuthForm,
  AuthFormGroup,
  AuthLabel,
  AuthInput,
  AuthButton,
  AuthLink,
  SuccessMessage,
  ErrorMessage,
} from "../../components/auth/AuthCard";

export default function FindAccountPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 11자리 초과 시 자르기
    if (numbers.length > 11) {
      return phone; // 기존 값 유지
    }

    // 010-XXXX-XXXX 형식으로 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    }
  };

  // 휴대폰 번호 유효성 검사
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  // 이름 유효성 검사
  const validateName = (name: string) => {
    const nameRegex = /^[가-힣]{2,10}$/;
    return nameRegex.test(name);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 입력 유효성 검사
    if (!validateName(name)) {
      setIsSuccess(false);
      setMessage("이름은 2-10자의 한글만 입력 가능합니다.");
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setIsSuccess(false);
      setMessage("휴대폰 번호는 010-XXXX-XXXX 형식으로 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      // API 연동 - /find-account 엔드포인트 호출 (axios 사용)
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await axios.get(`${baseURL}/api/auth/find-account`, {
        params: {
          username: name,
          phoneNumber: phone,
        },
      });
      console.log(response);

      // 성공 응답 처리
      setIsSuccess(true);
      const apiResponse = response.data;
      const userData = apiResponse.data;

      setMessage(
        `입력하신 정보로 가입된 이메일 주소는 '${
          userData.email || userData.maskedEmail
        }' 입니다.`
      );
    } catch (error: any) {
      setIsSuccess(false);

      // axios 에러 처리
      if (error.response) {
        // 서버에서 응답을 받았지만 에러 상태코드
        const errorMessage =
          error.response.data?.message ||
          "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.";
        setMessage(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        setMessage("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        // 요청 설정 중 에러 발생
        setMessage("요청 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="계정 찾기" subtitle="가입 시 입력한 정보를 입력해주세요">
      <AuthForm onSubmit={handleSubmit}>
        {message &&
          (isSuccess ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <ErrorMessage>{message}</ErrorMessage>
          ))}

        <AuthFormGroup>
          <AuthLabel htmlFor="name">이름</AuthLabel>
          <AuthInput
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="실명을 입력해주세요"
            required
          />
        </AuthFormGroup>

        <AuthFormGroup>
          <AuthLabel htmlFor="phone">휴대폰 번호</AuthLabel>
          <AuthInput
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            maxLength={13}
            required
          />
        </AuthFormGroup>

        <AuthButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              찾는 중...
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              계정 찾기
            </>
          )}
        </AuthButton>
      </AuthForm>

      <AuthLink to="/login">
        <i className="fas fa-arrow-left"></i>
        로그인으로 돌아가기
      </AuthLink>
    </AuthCard>
  );
}
