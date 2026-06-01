import ErrorScenePage from './ErrorScenePage';

const Unauthorized = () => (
  <ErrorScenePage
    code="403"
    label="Access Forbidden"
    title="여긴 들어갈 수 없어요"
    description={`접근 권한이 없어 이 페이지를 볼 수 없어요.\n필요한 권한이 있다면 다시 로그인하거나 관리자에게\n문의해주세요.`}
  />
);

export default Unauthorized;
