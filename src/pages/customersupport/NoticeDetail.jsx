import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const noticeData = [
  {
    id: 1,
    title: "신규 서비스 오픈 안내",
    content: `안녕하세요. 더 나은 서비스를 제공하기 위해 신규 서비스가 정식 오픈되었습니다.

    이번에 오픈된 서비스에서는 보다 빠르고 안정적인 이용 환경과 함께 다양한 기능이 추가되었습니다.

    주요 변경 사항:
    - 사용자 인터페이스(UI) 개선
    - 서비스 속도 및 안정성 향상
    - 신규 기능 추가 및 편의성 강화

    앞으로도 지속적인 업데이트를 통해 더욱 만족스러운 서비스를 제공해 드리겠습니다.

    많은 관심과 이용 부탁드립니다.

    감사합니다.`
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    content: `안녕하세요. 보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.

    일정: 2026년 4월 5일 (일) 02:00 ~ 06:00
    내용: 서버 안정화 및 기능 개선

    점검 시간 동안 서비스 이용이 제한될 수 있는 점 양해 부탁드립니다.`,
  },
  {
    id: 3,
    title: "운영 시간 변경 안내",
    content: `안녕하세요. 보다 원활한 서비스 운영을 위해 운영 시간이 아래와 같이 변경될 예정입니다.

    변경 일정:
    - 적용일: 2026년 3월 1일 (일)

    변경 전:
    - 09:00 ~18:00

    변경 후:
    - 10:00 ~19:00

    변경된 운영 시간은 서비스 품질 향상 및 고객 지원 강화를 위해 조정되었습니다.

    이용에 참고 부탁드리며, 더 나은 서비스를 제공할 수 있도록 노력하겠습니다.

    감사합니다.`
  },
];

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const notice = noticeData.find(
        (item) => item.id === Number(id)
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    if (!notice) {
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
                        <Link to="/customersupport/notice"><p className="text-gray-900 font-medium mb-4">공지사항</p></Link>
                        <Link to="/customersupport/faq"><p className="text-gray-500">자주하는 질문</p></Link>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="flex-1">

                    {/* 제목 */}
                    <h2 className="text-3xl font-semibold mb-10">
                        {notice.title}
                    </h2>

                    {/* 내용 */}
                    <div className="bg-white rounded-lg shadow-sm p-8 border whitespace-pre-line text-gray-700">
                        {notice.content}
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

export default NoticeDetail;