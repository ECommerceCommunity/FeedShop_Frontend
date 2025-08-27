import { ChangeEvent, FC, FormEvent, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import SuccessModal from "../../components/modal/SuccessModal";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const SignUpContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(249,115,22,0.08)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
  }
`;

const SignUpCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 32px 24px;
    margin: 20px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${slideInLeft} 0.8s ease-out 0.2s both;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  animation: ${float} 3s ease-in-out infinite;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const Form = styled.form`
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }
  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
    &::before {
      left: 100%;
    }
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    color: #ea580c;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 8px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const PasswordHint = styled.div`
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PasswordStrength = styled.div<{ isValid: boolean }>`
  color: ${(props) => (props.isValid ? "#10b981" : "#6b7280")};
  font-size: 0.8rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 24px 0;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
`;

const Checkbox = styled.input`
  margin-right: 12px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const PrivacyLink = styled.a`
  color: #667eea;
  text-decoration: underline;
  margin-left: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #764ba2;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: #9ca3af;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const SocialSignUpButton = styled.button`
  width: 100%;
  padding: 14px;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 강화된 비밀번호 유효성 검사
  const passwordValidation = {
    length: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isNameValid = formData.name.length >= 2 && formData.name.length <= 50;
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);

  // 전화번호 입력 처리 - 숫자만 허용하고 11자리로 제한
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, ""); // 숫자만 허용
      if (numericValue.length <= 11) {
        // 11자리로 제한
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 전화번호 유효성 검사 - 11자리 숫자
  const isPhoneValid = /^[0-9]{11}$/.test(formData.phone);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 유효성 검사
    if (!isNameValid) {
      setError("이름은 2자 이상 50자 이하로 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!isEmailValid) {
      setError("유효한 이메일 주소를 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다."
      );
      setLoading(false);
      return;
    }

    if (!isPasswordMatch) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (!isPhoneValid) {
      setError("유효한 전화번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보처리방침에 동의해주세요.");
      setLoading(false);
      return;
    }

    try {
      // 회원가입 API 호출 (fetch 사용)
      const baseURL = process.env.REACT_APP_API_URL || "https://localhost:8443";
      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name,
          phone: formData.phone,
          nickname: formData.nickname || formData.name, // 닉네임이 없으면 이름 사용
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "회원가입에 실패했습니다.";

        // 에러 메시지에 따른 구분된 처리
        if (
          errorMessage.includes("인증이 필요") ||
          errorMessage.includes("재인증")
        ) {
          setError("재인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
        } else if (
          errorMessage.includes("이미 존재") ||
          errorMessage.includes("중복")
        ) {
          setError("이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.");
        } else if (
          errorMessage.includes("비밀번호") ||
          errorMessage.includes("password")
        ) {
          setError(
            "비밀번호 형식이 올바르지 않습니다. 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요."
          );
        } else if (
          errorMessage.includes("이메일") ||
          errorMessage.includes("email")
        ) {
          setError("유효하지 않은 이메일 형식입니다.");
        } else if (
          errorMessage.includes("이름") ||
          errorMessage.includes("name")
        ) {
          setError("이름은 2자 이상 50자 이하로 입력해주세요.");
        } else if (
          errorMessage.includes("전화번호") ||
          errorMessage.includes("phone")
        ) {
          setError("유효하지 않은 전화번호 형식입니다.");
        } else {
          setError(errorMessage);
        }
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setError(
        err.message || "회원가입 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyClick = () => {
    // TODO: 개인정보처리방침 모달 또는 페이지로 이동
    window.open("/privacy-policy", "_blank");
  };

  const handleSocialSignUp = (provider: string) => {
    // 소셜 회원가입 구현
    console.log(`${provider} 회원가입 시도`);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <LogoSection>
          <Logo>FeedShop</Logo>
          <Subtitle>스마트한 쇼핑 경험을 위한 최고의 선택</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <InputWrapper>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
                minLength={2}
                maxLength={50}
              />
              <InputIcon>
                <i className="fas fa-user"></i>
              </InputIcon>
            </InputWrapper>
            {formData.name && (
              <PasswordStrength isValid={isNameValid}>
                <i
                  className={`fas fa-${
                    isNameValid ? "check-circle" : "times-circle"
                  }`}
                ></i>
                {isNameValid
                  ? "올바른 이름 형식입니다"
                  : "이름은 2자 이상 50자 이하로 입력해주세요"}
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nickname">닉네임 (선택사항)</Label>
            <InputWrapper>
              <Input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요 (없으면 이름 사용)"
              />
              <InputIcon>
                <i className="fas fa-user-tag"></i>
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <InputWrapper>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
              <InputIcon>
                <i className="fas fa-envelope"></i>
              </InputIcon>
            </InputWrapper>
            {formData.email && (
              <PasswordStrength isValid={isEmailValid}>
                <i
                  className={`fas fa-${
                    isEmailValid ? "check-circle" : "times-circle"
                  }`}
                ></i>
                {isEmailValid
                  ? "올바른 이메일 형식입니다"
                  : "유효한 이메일 주소를 입력해주세요"}
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <InputWrapper>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
                minLength={8}
              />
              <InputIcon>
                <i className="fas fa-lock"></i>
              </InputIcon>
            </InputWrapper>
            <PasswordHint>
              <i className="fas fa-info-circle"></i>
              비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다
            </PasswordHint>
            {formData.password && (
              <div>
                <PasswordStrength isValid={passwordValidation.length}>
                  <i
                    className={`fas fa-${
                      passwordValidation.length
                        ? "check-circle"
                        : "times-circle"
                    }`}
                  ></i>
                  {passwordValidation.length ? "8자 이상 ✓" : "8자 이상 ✗"}
                </PasswordStrength>
                <PasswordStrength isValid={passwordValidation.hasLetter}>
                  <i
                    className={`fas fa-${
                      passwordValidation.hasLetter
                        ? "check-circle"
                        : "times-circle"
                    }`}
                  ></i>
                  {passwordValidation.hasLetter ? "영문 포함 ✓" : "영문 포함 ✗"}
                </PasswordStrength>
                <PasswordStrength isValid={passwordValidation.hasNumber}>
                  <i
                    className={`fas fa-${
                      passwordValidation.hasNumber
                        ? "check-circle"
                        : "times-circle"
                    }`}
                  ></i>
                  {passwordValidation.hasNumber ? "숫자 포함 ✓" : "숫자 포함 ✗"}
                </PasswordStrength>
                <PasswordStrength isValid={passwordValidation.hasSpecial}>
                  <i
                    className={`fas fa-${
                      passwordValidation.hasSpecial
                        ? "check-circle"
                        : "times-circle"
                    }`}
                  ></i>
                  {passwordValidation.hasSpecial
                    ? "특수문자 포함 ✓"
                    : "특수문자 포함 ✗"}
                </PasswordStrength>
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <InputWrapper>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={8}
              />
              <InputIcon>
                <i className="fas fa-lock"></i>
              </InputIcon>
            </InputWrapper>
            {formData.confirmPassword && (
              <PasswordStrength isValid={isPasswordMatch && isPasswordValid}>
                <i
                  className={`fas fa-${
                    isPasswordMatch && isPasswordValid
                      ? "check-circle"
                      : "times-circle"
                  }`}
                ></i>
                {isPasswordMatch && isPasswordValid
                  ? "비밀번호가 일치합니다"
                  : "비밀번호가 일치하지 않습니다"}
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <InputWrapper>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="01012345678"
                required
                maxLength={11}
                title="11자리 숫자로 입력해주세요 (예: 01012345678)"
              />
              <InputIcon>
                <i className="fas fa-phone"></i>
              </InputIcon>
            </InputWrapper>
            {formData.phone && (
              <PasswordStrength isValid={isPhoneValid}>
                <i
                  className={`fas fa-${
                    isPhoneValid ? "check-circle" : "times-circle"
                  }`}
                ></i>
                {isPhoneValid
                  ? "올바른 전화번호 형식입니다"
                  : "유효한 전화번호를 입력해주세요"}
              </PasswordStrength>
            )}
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              required
            />
            <span>
              개인정보처리방침에 동의합니다
              <PrivacyLink onClick={handlePrivacyClick}>
                (자세히 보기)
              </PrivacyLink>
            </span>
          </CheckboxContainer>

          <SignUpButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <i
                  className="fas fa-spinner fa-spin"
                  style={{ marginRight: "8px" }}
                ></i>
                회원가입 중...
              </>
            ) : (
              <>
                <i
                  className="fas fa-user-plus"
                  style={{ marginRight: "8px" }}
                ></i>
                회원가입
              </>
            )}
          </SignUpButton>

          <Divider>또는</Divider>

          <LoginLink to="/login">
            <i
              className="fas fa-sign-in-alt"
              style={{ marginRight: "8px" }}
            ></i>
            이미 계정이 있으신가요? 로그인
          </LoginLink>
        </Form>
      </SignUpCard>

      <SuccessModal
        open={showSuccess}
        title="회원가입 완료"
        message="회원가입이 신청이 성공적으로 완료되었습니다! 회원가입을 최종 완료하려면 사용자 이메일 주소로 발송된 인증 메일을 확인해주세요."
        onClose={handleSuccessClose}
      />
    </SignUpContainer>
  );
};

export default SignUp;
