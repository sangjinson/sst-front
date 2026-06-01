import ErrorScenePage from './ErrorScenePage';

const NotFoundPage = () => (
  <ErrorScenePage
    code="404"
    label="Page Not Found"
    title="길을 잃은 것 같아요"
    description={`찾으려는 페이지가 사라졌거나 주소가 바뀌었어요.\n카피바라 탐험대가 손전등으로 다시 찾아보는 중입니다.`}
  />
);

export default NotFoundPage;
