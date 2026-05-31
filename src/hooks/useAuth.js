// useAuth.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@api/axios';
import { useApi } from '@hooks/useApi';
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값



export const useAuth = () => {
  const apiTool = useApi(); // Api 의 사용
  const {getConfig, setConfig} = useConfig();   // Config 값 가져오기

  const queryClient = useQueryClient();

  // 🚀 1. 백엔드에서 HttpOnly 쿠키를 이용해 내 정보를 가져오는 Fetcher 함수
  const fetchUser = async () => {
    // 🚀 최적화: 브라우저에 로그인 플래그가 없으면 백엔드(Spring)를 찌르지 않고 바로 null 반환 (서버 부하 방지)
    if (!localStorage.getItem('isLogin')) return null;
    try {
      const authData = await apiTool.fetchMe(); // 회원여부를 확인
      console.log("test");
      console.log(authData);

      setConfig('user', authData.data)
      setConfig('user.isAuth', true)
      return authData.data;
    } catch (error) {
      // 🚀 서버 세션 만료 등 예외 발생 시 로컬 플래그 지우기
      localStorage.removeItem('isLogin');
      return null;
    }
  };

  // 🚀 2. useQuery: 기존 Context의 user, loading 상태를 완벽히 대체합니다.
  const { data: user = null, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchUser,
    //staleTime: 1000, // 🚀 5분 동안은 화면을 이동해도 /auth/me API를 중복 호출하지 않음 (캐시 활용)
    staleTime: 1000 * 60 * 5, // 🚀 5분 동안은 화면을 이동해도 /auth/me API를 중복 호출하지 않음 (캐시 활용)
  });

  // 🚀 3. useMutation: 로그인 요청 처리
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const loginRes = await apiTool.login(credentials);
      return loginRes.data;
    },
    onSuccess: async (userData) => {
      localStorage.setItem('isLogin', 'true');
      setConfig('user', userData);
      setConfig('user.isAuth', true);
      queryClient.setQueryData(['auth', 'user'], userData);

      // 로그인 성공 후 프로필 정보도 함께 로드
      try {
        const profileRes = await apiTool.getProfile();
        const { mapDataToState } = await import('@utils/common');
        const profileData = mapDataToState('profile', profileRes.data);
        setConfig('profile', profileData);
      } catch (e) {
        console.error('프로필 로드 실패:', e);
      }
    },
  });

  // 🚀 4. useMutation: 로그아웃 요청 처리
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const currentPath = window.location.pathname + window.location.search;
      await apiTool.logout();
      return currentPath;
    },
    onSuccess: (currentPath) => {
      localStorage.removeItem('isLogin');
      setConfig('user', {})
      setConfig('user.isAuth', false)
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      const restrictedPaths = ['/plan', '/showcase/hotplace/write', '/showcase/life/write'];
      if (restrictedPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/';
      } else {
        window.location.href = currentPath;
      }
    },
    onError: () => {
      // 🚀 서버 로그아웃 실패(네트워크 오류 등) 시에도 프론트 상태는 강제 초기화하여 사용자 보호
      localStorage.removeItem('isLogin');
      queryClient.setQueryData(['auth', 'user'], null);
      window.location.href = '/';
    }
  });

  // 🚀 5. 로컬 강제 로그아웃 (탈퇴 등 특수 상황에서 사용, MemberInfo.jsx 호환용)
  const localLogout = () => {
    localStorage.removeItem('isLogin');
    queryClient.setQueryData(['auth', 'user'], null);
    window.location.href = '/';
  };

  // 🚀 6. 기존 컴포넌트들과의 완벽한 호환성을 위한 Return 규격 맞춤
  return {
    user,
    // 🚀 초기 로딩 + 로그인 로딩 + 로그아웃 로딩 상태를 하나로 합쳐서 기존 'loading' 변수와 호환
    loading: isUserLoading || loginMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutateAsync, // .mutateAsync를 넘겨 기존처럼 await login() 사용 가능
    logout: logoutMutation.mutateAsync,
    localLogout,
  };
};