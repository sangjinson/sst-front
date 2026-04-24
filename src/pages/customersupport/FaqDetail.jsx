import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const faqData = [
  {
    id: 1,
    title: "AI 여행 일정은 어떻게 생성되나요?",
    content: `안녕하세요! 경기도 구석구석을 연결하는 스마트한 AI 여행 플래너입니다.

    저희 AI는 경기도 31개 시·군의 방대한 관광 데이터와 실시간 리뷰를 분석하여, 사용자의 취향에 딱 맞는 최적의 동선을 설계합니다. '보는 것, 먹는 것, 노는 것, 자는 것'을 한 번에 해결하는 방법은 아주 간단합니다!

    [AI 여행 일정 생성 단계]

    1. 내거리를 클릭하여 여행을 가고 싶은 지역을 선택합니다.
    (예: 수원, 가평, 파주 등 경기도 내 가고 싶은 지역 선택)

    2. 여행 기간과 일정을 선택합니다.
    (당일치기부터 1박 2일 이상까지 자유롭게 설정 가능합니다.)

    3. 자신이 가고 싶은 여행의 테마를 선택합니다.
    (볼거리, 먹거리, 놀거리, 잘거리 등 자신이 가고 싶은 곳을 알려주세요.)

    4. AI가 짜준 여행일정을 보고 여행코스를 수정해보세요.
    (추천된 장소가 마음에 들지 않는다면 언제든 다른 곳으로 변경할 수 있습니다.)

    복잡한 여행 계획은 이제 AI에게 맡기고, 여러분은 즐거운 경기도 여행을 즐기기만 하세요!

    감사합니다.`
  },
  {
    id: 2,
    title: "생성된 일정을 일행과 공유할 수 있나요?",
    content: `네! 정성껏 만든 경기도 여행 일정을 일행과 손쉽게 공유할 수 있습니다.

    1. 링크 복사: 고유 URL 주소를 복사해 단톡방이나 메모장에 보관할 수 있습니다.
    2. PDF 저장: 여행 중 데이터 사용이 걱정된다면, 일정을 PDF 파일로 내려받아 오프라인에서도 확인할 수 있습니다.

    함께 가는 친구, 가족들과 함께 일정을 확인하고, 모두가 만족하는 경기도 여행을 만들어보세요!`
  },
  {
    id: 3,
    title: "로그인을 하지 않아도 일정을 저장할 수 있나요?",
    content: `아쉽게도 생성하신 여행 일정을 안전하게 보관하기 위해서는 로그인이 꼭 필요합니다. 

    로그인 없이 저장되지 않는 이유는 다음과 같습니다.

    1. 소중한 일정실실 방지: 
    로그인을 하지 않으면 브라우저의 방문 기록이 삭제되거나 기기가 바뀌었을 때, 공들여 짠 경기도 여행 
    코스를 다시 찾을 수 없게 됩니다.

    2. 언제 어디서든 확인: 
    PC에서 짜둔 일정을 여행 당일 스마트폰으로 확인하려면, 계정에 안전하게 저장되어 있어야 합니다.

    카카오계정을 이용하시면 별도의 가입 절차 없이 3초 만에 간편하게 시작하실 수 있습니다. 지금 바로 
    로그인하고 당신만의 경기도 여행 지도를 완성해 보세요!`
  },
];

const FaqDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const faq = faqData.find(
        (item) => item.id === Number(id)
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    if (!faq) {
        return <div className="p-10">존재하지 않는 게시글입니다.</div>;
    }

    return (
        <div className="bg-[#f7f8fa] min-h-screen py-20">
            <div className="max-w-5xl mx-auto flex gap-20">

                {/* 왼쪽 */}
                <div className="w-56">
                    <h3 className="text-lg font-semibold mb-6">고객지원</h3>
                    <div className="border-t border-gray-300 mb-6"></div>

                    <div className="space-y-4">
                        <Link to="/customersupport/notice"><p className="text-gray-500 mb-4">공지사항</p></Link>
                        <Link to="/customersupport/faq"><p className="text-gray-900 font-medium">자주하는 질문</p></Link>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="flex-1">

                    {/* breadcrumb */}
                    <div className="text-sm mb-2">
                        <span className="text-gray-400">홈 &gt; 고객지원 &gt; </span>
                        <span className="font-semibold text-gray-700">자주하는 질문</span>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-3xl font-semibold mb-10">
                        {faq.title}
                    </h2>

                    {/* 내용 */}
                    <div className="bg-white rounded-lg shadow-sm p-8 border whitespace-pre-line text-gray-700">
                        {faq.content}
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center mt-12">
                        <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                        목록
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default FaqDetail;