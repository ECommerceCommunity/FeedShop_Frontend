import axiosInstance from "../../api/axios";
import { ImageUploadResponse, ApiResponse } from "../../types/feed";

/**
 * 단일 이미지 파일을 서버에 업로드합니다
 * @param file 업로드할 이미지 파일
 * @param sortOrder 이미지 정렬 순서 (선택사항)
 * @returns 업로드된 이미지 정보
 */
export const uploadSingleImage = async (
  file: File,
  sortOrder?: number
): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (sortOrder !== undefined) {
      formData.append("sortOrder", sortOrder.toString());
    }

    const response = await axiosInstance.post<ApiResponse<ImageUploadResponse>>(
      "/api/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("이미지 업로드 실패:", error);
    throw new Error(
      error.response?.data?.message || "이미지 업로드에 실패했습니다."
    );
  }
};

/**
 * 여러 이미지 파일을 동시에 업로드합니다
 * @param files 업로드할 이미지 파일 배열
 * @returns 업로드된 이미지 정보 배열
 */
export const uploadMultipleImages = async (
  files: File[]
): Promise<ImageUploadResponse[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadSingleImage(file, index)
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    console.error("다중 이미지 업로드 실패:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

/**
 * Base64 데이터 URL을 Blob으로 변환합니다
 * @param dataURL Base64 데이터 URL
 * @returns Blob 객체
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  if (typeof dataURL !== "string" || !dataURL.startsWith("data:")) {
    throw new Error("잘못된 데이터 URL 형식입니다.");
  }
  const arr = dataURL.split(",");
  // 엄격한 MIME 타입 추출 및 예외 처리
  const mimeMatch = arr[0].match(/^data:([a-zA-Z0-9\/+\-.]+);base64$/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  if (!arr[1]) {
    throw new Error("Base64 데이터가 존재하지 않습니다.");
  }
  let bstr;
  try {
    bstr = atob(arr[1]);
  } catch (e) {
    throw new Error("Base64 디코딩에 실패했습니다.");
  }
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Base64 데이터 URL을 File 객체로 변환합니다
 * @param dataURL Base64 데이터 URL
 * @param filename 파일명
 * @returns File 객체
 */
export const dataURLToFile = (dataURL: string, filename: string): File => {
  const blob = dataURLToBlob(dataURL);
  return new File([blob], filename, { type: blob.type });
};

/**
 * 이미지 파일의 유효성을 검사합니다
 * @param file 검사할 파일
 * @param maxSizeInMB 최대 파일 크기 (MB)
 * @returns 유효성 검사 결과
 */
export const validateImageFile = (
  file: File,
  maxSizeInMB: number = 5
): { isValid: boolean; error?: string } => {
  // 파일 타입 검사
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.",
    };
  }

  // 파일 크기 검사
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `파일 크기는 ${maxSizeInMB}MB 이하여야 합니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 이미지 미리보기 URL을 생성합니다
 * @param file 이미지 파일
 * @returns Promise<string> 미리보기 URL
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("이미지 미리보기 생성에 실패했습니다."));
      }
    };
    reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
    reader.readAsDataURL(file);
  });
};

/**
 * 기존 업로드된 이미지들을 실제 파일로 변환하여 업로드합니다
 * (현재 Base64로 저장된 이미지들을 서버에 업로드)
 * @param base64Images Base64 이미지 배열
 * @returns 업로드된 이미지 URL 배열
 */
export const uploadBase64Images = async (
  base64Images: string[]
): Promise<string[]> => {
  try {
    const files = base64Images.map((base64, index) =>
      dataURLToFile(base64, `image_${index}_${Date.now()}.jpg`)
    );

    const uploadResults = await uploadMultipleImages(files);
    return uploadResults.map((result) => result.imageUrl);
  } catch (error: any) {
    console.error("Base64 이미지 업로드 실패:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

/**
 * 압축된 이미지를 생성합니다 (용량 최적화)
 * @param file 원본 이미지 파일
 * @param quality 압축 품질 (0-1)
 * @param maxWidth 최대 너비 (px)
 * @returns Promise<File> 압축된 이미지 파일
 */
export const compressImage = (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1200
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // 비율 유지하면서 크기 조정
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 압축된 이미지를 Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("이미지 압축에 실패했습니다."));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error("이미지 로드에 실패했습니다."));
    img.src = URL.createObjectURL(file);
  });
};
