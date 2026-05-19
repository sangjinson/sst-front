const LoginRequiredModal = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded bg-white px-10 py-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-orange-300 text-4xl text-orange-300">
          !
        </div>

        <h2 className="text-2xl font-bold text-gray-700">
          로그인이 필요합니다
        </h2>

        <p className="mt-4 fs-down-1 text-gray-500">
          로그인 후 이용 가능한 페이지입니다.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-200 px-5 py-2.5 fs-down-1 font-bold text-gray-500">
            닫기
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="rounded bg-[#0F9B73] px-5 py-2.5 fs-down-1 font-bold text-white">
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;