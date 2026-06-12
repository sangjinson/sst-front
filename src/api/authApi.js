import api from './axios'; //  기존에 만들어둔 인터셉터 적용 인스턴스 사용

//  1. 이메일 찾기 API (이름 + 전화번호)
export const findEmail = async (name, telno) => {
  const response = await api.post('/auth/find-email', { name, telno });
  return response.data.data; // 백엔드의 ApiResponse<List<String>> 에서 배열만 추출
};

//  2. 비밀번호 재설정 (임시 비밀번호 발급) API (이메일 + 이름)
export const resetPassword = async (email, name) => {
  const response = await api.post('/auth/reset-password', { email, name });
  return response.data; 
};

// ---------------------------------------------------------
// 💡 (참고) 향후 로그인, 회원가입 등도 이곳에 추가하시면 됩니다!
// ---------------------------------------------------------
// export const login = async (email, password) => {
//   const response = await api.post('/auth/login', { email, password });
//   return response.data;
// };
//
// export const signUp = async (formData) => {
//   const response = await api.post('/auth/signup', formData);
//   return response.data;
// };