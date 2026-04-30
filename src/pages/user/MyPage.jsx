import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import { getWishlist, STORAGE_KEY } from '@hooks/useWishlist';
import { getAllPosts } from '@pages/showcase/hotplace/communityHotplaceData';

const STATUS_COLOR = {
  "여행완료":  { bg: "#d1fae5", color: "#065f46" },
  "여행 완료": { bg: "#d1fae5", color: "#065f46" },
  "여행 예정": { bg: "#fef3c7", color: "#92400e" },
  "여행중":    { bg: "#dbeafe", color: "#1e40af" },
};

const ITEMS_PER_PAGE = 8;

const getTripStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return '여행 예정';
  if (now > end) return '여행 완료';
  return '여행중';
};

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-7 flex-wrap">
    <button onClick={() => onPageChange(Math.max(1, page - 1))}
      className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
      &lt;
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button key={p} onClick={() => onPageChange(p)}
        className={`w-[34px] h-[34px] rounded-full text-sm transition-colors flex items-center justify-center ${
          p === page ? 'bg-[#0F9B73] text-white font-bold border-none' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        }`}>
        {p}
      </button>
    ))}
    <button onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
      &gt;
    </button>
  </div>
);

// ─────────────────────────────────────────
// 섹션: 회원정보
// ─────────────────────────────────────────
const MemberInfo = ({ profile, onUpdate, profileImg, onImgChange }) => {
  const imgRef = useRef(null);
  const [form, setForm] = useState({
    name: profile.name || '',
    nickname: profile.nickname || '',
    phone: profile.phone || '',
    zipcode: '',
    address: '',
    detailAddress: '',
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMsg('');
    }
  };

  // ✅ 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) { alert('닉네임을 입력해주세요.'); return; }
    if (form.nickname.trim().length < 2) { alert('닉네임은 2자 이상이어야 합니다.'); return; }
    // TODO: 실제 API 연동
    // const res = await axios.get(`/api/members/check-nickname?nickname=${form.nickname}`);
    const isDuplicate = false; // 임시
    if (isDuplicate) {
      setNicknameMsg('이미 사용 중인 닉네임입니다.');
      setNicknameChecked(false);
    } else {
      setNicknameMsg('사용 가능한 닉네임입니다.');
      setNicknameChecked(true);
    }
  };

  // ✅ 다음 주소 API
  const handleAddressSearch = () => {
    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
          detailAddress: '',
        }));
      },
    }).open();
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('이름을 입력해주세요.'); return; }
    if (!form.nickname.trim()) { alert('닉네임을 입력해주세요.'); return; }
    if (!nicknameChecked) { alert('닉네임 중복 확인을 해주세요.'); return; }
    if (!form.phone.trim()) { alert('전화번호를 입력해주세요.'); return; }
    // TODO: 실제 API 연동
    onUpdate({ name: form.name, nickname: form.nickname, phone: form.phone });
    alert('회원정보가 수정되었습니다.');
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">회원 정보 수정</h2>

      {/* ✅ 프로필 사진 변경 */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24">
          <img src={profileImg} alt="프로필"
            className="w-24 h-24 rounded-full object-cover border-[3px] border-[#0F9B73]" />
          <button type="button" onClick={() => imgRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-[#0F9B73] rounded-full flex items-center justify-center shadow-md hover:bg-[#0d8a66] transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={onImgChange} />
        </div>
        <p className="text-xs text-gray-400 mt-2">카메라 아이콘을 눌러 사진 변경</p>
      </div>

      <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-200 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 이름 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">이름 *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="이름을 입력해주세요"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">전화번호 *</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

          {/* 닉네임 + 중복확인 */}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">닉네임 *</label>
            <div className="flex gap-2">
              <input name="nickname" value={form.nickname} onChange={handleChange}
                placeholder="닉네임을 입력해주세요 (2자 이상)"
                className={`flex-1 px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  nicknameChecked
                    ? 'border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]'
                    : 'border-gray-200 focus:border-[#0F9B73]'
                }`} />
              <button type="button" onClick={handleNicknameCheck}
                className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition whitespace-nowrap">
                중복 확인
              </button>
            </div>
            {nicknameMsg && (
              <p className={`text-xs mt-1 ${nicknameChecked ? 'text-[#0F9B73]' : 'text-red-500'}`}>
                {nicknameMsg}
              </p>
            )}
          </div>

          {/* 우편번호 + 주소검색 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">우편번호</label>
            <div className="flex gap-2">
              <input name="zipcode" value={form.zipcode} readOnly
                placeholder="우편번호"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 cursor-not-allowed" />
              <button type="button" onClick={handleAddressSearch}
                className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition whitespace-nowrap">
                주소 검색
              </button>
            </div>
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">주소</label>
            <input name="address" value={form.address} readOnly
              placeholder="주소 검색을 이용해주세요"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 cursor-not-allowed" />
          </div>

          {/* 상세주소 */}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">상세주소</label>
            <input name="detailAddress" value={form.detailAddress} onChange={handleChange}
              placeholder="상세주소를 입력해주세요 (동, 호수 등)"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

        </div>

        <button onClick={handleSave}
          className="mt-6 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold transition-colors">
          저장하기
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 뽐낼거리
// ─────────────────────────────────────────
const MyShowcase = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [myPosts, setMyPosts] = useState(getAllPosts);

  const totalPages = Math.ceil(myPosts.length / ITEMS_PER_PAGE) || 1;
  const currentItems = myPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    setMyPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 뽐낼 거리</h2>

      {myPosts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🖼️</div>
          <p className="text-sm mb-4">작성한 게시글이 없습니다.</p>
          <button onClick={() => navigate('/showcase/hotplace/write')}
            className="px-5 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-medium hover:bg-[#0d8a66] transition">
            핫플거리 작성하러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['번호', '제목', '장소', '작성일', '조회', '삭제'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((post, idx) => (
                  <tr key={post.id} onClick={() => navigate(`/showcase/hotplace/view/${post.id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="py-4 px-4 text-sm text-gray-500">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 hover:text-[#0F9B73] transition-colors">{post.title}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{post.place}</td>
                    <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">{post.regDt}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{post.viewCnt}</td>
                    <td className="py-4 px-4">
                      <button onClick={(e) => handleDelete(e, post.id)}
                        className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {myPosts.length > ITEMS_PER_PAGE && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 일정관리
// ─────────────────────────────────────────
const MySchedule = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    setSchedules(saved);
  }, []);

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE) || 1;
  const currentItems = schedules.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('일정을 삭제하시겠습니까?')) return;
    const updated = schedules.filter(s => s.id !== id);
    localStorage.setItem('savedTrips', JSON.stringify(updated));
    setSchedules(updated);
  };

  const handleRowClick = (s) => {
    navigate('/plan/result', {
      state: {
        region: s.region,
        period: s.period,
        themes: s.themes || [],
        startDate: s.startDate,
        endDate: s.endDate,
        schedule: s.schedule,
        savedId: s.id,
        savedName: s.name,
      }
    });
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 일정 관리</h2>

      {schedules.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-sm mb-4">저장된 일정이 없습니다.</p>
          <button onClick={() => navigate('/plan')}
            className="px-5 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-medium hover:bg-[#0d8a66] transition">
            AI 일정 만들러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['번호', '여행 이름', '지역', '여행 날짜', '상태', '삭제'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((s, idx) => {
                  const status = getTripStatus(s.startDate, s.endDate);
                  const sc = STATUS_COLOR[status] || { bg: '#f3f4f6', color: '#374151' };
                  return (
                    <tr key={s.id} onClick={() => handleRowClick(s)}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="py-4 px-4 text-sm text-gray-500">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 hover:text-[#0F9B73] transition-colors">{s.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{s.region}</td>
                      <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">{s.startDate} ~ {s.endDate}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                          style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button onClick={(e) => handleDelete(e, s.id)}
                          className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {schedules.length > ITEMS_PER_PAGE && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 찜목록
// ─────────────────────────────────────────
const MyWishlist = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(() => getWishlist());
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(likes.length / ITEMS_PER_PAGE) || 1;
  const currentItems = likes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleRemove = (item) => {
    const updated = likes.filter((w) => !(String(w.id) === String(item.id) && w.type === item.type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLikes(updated);
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 찜 목록</h2>
      {likes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💔</div>
          <p className="text-sm">아직 찜한 목록이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {currentItems.map((item, idx) => (
              <div key={idx}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                onClick={() => navigate(`/${item.region}/${item.type}/view?id=${item.id}`)}>
                <img src={item.image} alt={item.name}
                  className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3 pb-8">
                  <div className="text-sm font-semibold truncate text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                </div>
                <div className="absolute bottom-2 left-3 bg-black/45 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.address?.split(' ').slice(0, 2).join(' ')}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                  className="absolute bottom-1.5 right-2 text-lg hover:scale-110 transition-transform" title="찜 해제">
                  ❤️
                </button>
              </div>
            ))}
          </div>
          {likes.length > ITEMS_PER_PAGE && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// 카드 메뉴
// ─────────────────────────────────────────
const CARDS = [
  { key: 'member',   label: '회원정보',    icon: '👤' },
  { key: 'showcase', label: '내 뽐낼거리', icon: '🖼️' },
  { key: 'schedule', label: '내 일정관리', icon: '📅' },
  { key: 'wishlist', label: '내 찜목록',   icon: '❤️' },
];

// ─────────────────────────────────────────
// 메인 MyPage
// ─────────────────────────────────────────
const MyPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.tab || 'member');
  const [profile, setProfile] = useState({
    name: '홍길동',
    nickname: '길동이',
    phone: '010-5882-1253',
    email: 'hong01@ksmart.or.kr'
  });
  const [profileImg, setProfileImg] = useState(
    'https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png'
  );

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'member':
        return (
          <MemberInfo
            profile={profile}
            onUpdate={setProfile}
            profileImg={profileImg}
            onImgChange={handleImgChange}
          />
        );
      case 'showcase': return <MyShowcase />;
      case 'schedule': return <MySchedule />;
      case 'wishlist': return <MyWishlist />;
      default: return null;
    }
  };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-10 lg:py-10 flex flex-col lg:flex-row gap-6">

        {/* 사이드바 */}
        <aside className="hidden lg:flex flex-col gap-4 w-[220px] shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-4">마이페이지</h3>
            <div className="flex flex-col items-center gap-2 mb-4">
              {/* ✅ 사이드바 프로필 이미지도 동일하게 */}
              <div className="relative w-16 h-16">
                <img src={profileImg} alt="프로필"
                  className="w-16 h-16 rounded-full object-cover border-[3px] border-[#0F9B73]" />
              </div>
              <div className="font-bold text-gray-900">{profile.name} 🏅</div>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-sm">📅</span>가입일: 2026-04-10</li>
              <li className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-sm">📞</span>{profile.phone}</li>
              <li className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-sm">✉️</span>{profile.email}</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3">프로필 더보기</h3>
            <ul className="flex flex-col gap-1.5">
              <Link to="/customersupport/notice"
                className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
                <span>👤</span> 공지사항
              </Link>
              <Link to="/customersupport/faq"
                className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
                <span>❓</span> 자주 하는 질문
              </Link>
            </ul>
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          <Breadcrumb
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]}
            className="mb-0"
          />

          {/* 카드 메뉴 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CARDS.map((card) => (
              <div key={card.key} onClick={() => setActiveSection(card.key)}
                className={`bg-white border-[1.5px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 ${
                  activeSection === card.key
                    ? 'border-[#0F9B73] bg-[#f0fdf9] shadow-md'
                    : 'border-gray-200 shadow-sm hover:border-[#0F9B73]'
                }`}>
                <span className={`text-sm font-bold self-start ${activeSection === card.key ? 'text-[#0F9B73]' : 'text-gray-700'}`}>
                  {card.label}
                </span>
                <div className={`w-12 h-12 md:w-[58px] md:h-[58px] rounded-full border-[3px] flex items-center justify-center text-xl md:text-2xl transition-colors ${
                  activeSection === card.key ? 'border-[#0F9B73]' : 'border-blue-500'
                }`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* 섹션 컨텐츠 */}
          <div key={activeSection} className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] animate-[fadeIn_0.3s_ease-in-out]">
            {renderSection()}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyPage;