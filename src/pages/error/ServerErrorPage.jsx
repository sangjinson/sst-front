import ErrorScenePage from './ErrorScenePage';

const ServerErrorPage = () => (
  <ErrorScenePage
    code="500"
    label="Server Error"
    title="잠시 문제가 생겼어요"
    description="서버에서 문제가 발생했어요. 잠시 후 다시 시도해주세요."
  />
);

export default ServerErrorPage;

