interface ImageBaseUrls {
  development: string;
  production: string;
}

const IMAGE_BASE_URLS: ImageBaseUrls = {
  development: 'https://storage.cloud.google.com/feedshop-bucket',
  production: 'https://storage.googleapis.com/feedshop-bucket'
};

// 현재 환경에 따른 베이스 URL 선택
export const getImageBaseUrl = (): string => {
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('localhost');
  
  return isProduction ? IMAGE_BASE_URLS.production : IMAGE_BASE_URLS.development;
};

/**
 * 상대 경로를 전체 GCS URL로 변환
 */
export const convertToUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) return '';
  
  // 이미 전체 URL인 경우 그대로 반환
  if (relativePath.includes('storage.googleapis.com') || relativePath.includes('storage.cloud.google.com')) {
    return relativePath;
  }
  
  // 상대 경로에 베이스 URL 붙이기
  const baseUrl = getImageBaseUrl();
  
  // 경로 정리
  let cleanPath = relativePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `${baseUrl}/${cleanPath}`;
};

/**
 * 배열의 모든 상대 경로를 전체 URL로 변환
 */
export const convertImageArrayToGCS = (relativePathArray: string[] | undefined | null): string[] => {
  if (!Array.isArray(relativePathArray)) return [];
  return relativePathArray.map(convertToUrl);
};