import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@api/axios';
import TextInput from '@components/modules/form/TextInput';
import SelectInput from '@components/modules/form/SelectInput';

const AdminMemberEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    mbrEmail: '',
    mbrPassword: '',
    mbrName: '',
    mbrNickname: '',
    mbrTelno: '',
    mbrZip: '',
    mbrAddr: '',
    mbrDaddr: '',
    mbrAuthCd: '',
    mbrUseYn: ''
  });

  // 🚀 1. 닉네임 중복 검사를 위한 상태 추가
  const [originalNickname, setOriginalNickname] = useState(''); // 기존 닉네임 기억용
  const [nicknameChecked, setNicknameChecked] = useState(true); // 초기값 true (기존 닉네임이니까)
  const [nicknameMsg, setNicknameMsg] = useState('');

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const response = await api.get(`/admin/members/${id}`);
        const data = response.data.data;
        
        setForm({
          mbrEmail: data.mbrEmail || '',
          mbrPassword: '', 
          mbrName: data.mbrName || '',
          mbrNickname: data.mbrNickname || '',
          mbrTelno: data.mbrTelno || '',
          mbrZip: data.mbrZip || '',
          mbrAddr: data.mbrAddr || '',
          mbrDaddr: data.mbrDaddr || '',
          mbrAuthCd: data.mbrAuthCd || '',
          mbrUseYn: data.mbrUseYn || ''
        });

        // 🚀 2. 데이터 페치 시 원본 닉네임 저장
        setOriginalNickname(data.mbrNickname || '');
        setNicknameChecked(true);

      } catch (error) {
        alert('데이터를 불러오는데 실패했습니다.');
        navigate('/admin/members');
      }
    };
    fetchMemberDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // 🚀 3. 닉네임이 입력될 때 기존 닉네임과 비교하여 상태 초기화
    if (name === 'mbrNickname') {
      if (value.trim() === originalNickname) {
        setNicknameChecked(true); // 기존 닉네임으로 되돌리면 검사 통과
        setNicknameMsg('');
      } else {
        setNicknameChecked(false); // 글자가 바뀌면 다시 검사해야 함
        setNicknameMsg('');
      }
    }
  };

  // 🚀 4. 중복 확인 API 호출 로직 (MemberInfo.jsx와 동일한 API 활용)
  const handleNicknameCheck = async () => {
    const trimmedNickname = form.mbrNickname.trim();
    if (!trimmedNickname) { 
      alert('닉네임을 입력해주세요.'); 
      return; 
    }
    
    // 원래 닉네임과 같으면 굳이 서버에 안 물어봐도 됨
    if (trimmedNickname === originalNickname) {
      setNicknameMsg('기존 닉네임과 동일하여 사용 가능합니다.');
      setNicknameChecked(true); 
      return; 
    }

    if (trimmedNickname.length < 2) { 
      alert('닉네임은 2자 이상이어야 합니다.'); 
      return; 
    }

    try {
      const response = await api.get(`/auth/check-nickname`, {
        params: { nickname: trimmedNickname }
      });
      const isDuplicate = response.data.data; 

      if (isDuplicate) {
        setNicknameMsg('이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      } else {
        setNicknameMsg('사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      }
    } catch (error) {
      alert('중복 확인 중 서버 에러가 발생했습니다.');
    }
  };

  const handleAddressSearch = () => {
    if (!window.daum) { 
      alert('주소 검색 서비스를 불러오는 중입니다.'); 
      return; 
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm(prev => ({
          ...prev,
          mbrZip: data.zonecode,
          mbrAddr: data.roadAddress || data.jibunAddress,
          mbrDaddr: '', 
        }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚀 5. 제출 전 프론트엔드 최종 방어 (UX)
    if (form.mbrNickname !== originalNickname && !nicknameChecked) {
      alert('닉네임 중복 확인을 진행해주세요.');
      return;
    }

    try {
      await api.put(`/admin/members/${id}`, form);
      alert('수정이 완료되었습니다.');
      navigate('/admin/members');
    } catch (error) {
      // 백엔드에서 409 Conflict 에러를 던지면 이쪽으로 빠집니다.
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message || '중복된 데이터가 존재합니다.');
      } else {
        alert('수정 중 에러가 발생했습니다.');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">회원 정보 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <TextInput
          id="mbrEmail"
          name="mbrEmail"
          value={form.mbrEmail}
          readOnly
          className="bg-gray-50 text-gray-500 cursor-not-allowed"
          label="이메일 (수정 불가)"
        />

        <TextInput
          id="mbrPassword"
          name="mbrPassword"
          type="password"
          label="비밀번호 변경 (선택)"
          placeholder="변경할 경우에만 입력하세요"
          value={form.mbrPassword}
          onChange={handleChange}
        />

        {/* 🚀 닉네임 영역 레이아웃 수정 (버튼 추가) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="mbrName"
            name="mbrName"
            label="이름"
            value={form.mbrName}
            onChange={handleChange}
            required
          />
          
          <div className="flex flex-col">
            <div className="flex gap-2 items-end h-full">
              <TextInput
                id="mbrNickname"
                name="mbrNickname"
                label="닉네임"
                value={form.mbrNickname}
                onChange={handleChange}
                required
                className="flex-1"
                inputClassName={
                  nicknameChecked && form.mbrNickname !== originalNickname 
                    ? 'border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]' 
                    : ''
                }
              />
              {/* TextInput 높이(기본 48px)에 맞춘 버튼 */}
              <button 
                type="button" 
                onClick={handleNicknameCheck}
                className="px-4 py-2 h-12 mb-0 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition whitespace-nowrap"
              >
                중복 확인
              </button>
            </div>
            {/* 메시지 출력 영역 */}
            {nicknameMsg && (
              <p className={`text-xs mt-1 ml-1 ${nicknameChecked ? 'text-[#0F9B73]' : 'text-red-500'}`}>
                {nicknameMsg}
              </p>
            )}
          </div>
        </div>

        <TextInput
          id="mbrTelno"
          name="mbrTelno"
          label="전화번호"
          value={form.mbrTelno}
          onChange={handleChange}
        />

        <div className="border border-gray-100 p-4 rounded-lg space-y-3 bg-gray-50/50">
          <label className="block text-sm font-medium text-gray-700">주소 정보</label>
          <div className="flex gap-2">
            <TextInput
              id="mbrZip"
              name="mbrZip"
              value={form.mbrZip}
              readOnly
              placeholder="우편번호"
              className="flex-1"
            />
            <button 
              type="button" 
              onClick={handleAddressSearch}
              className="px-4 py-2 mt-auto h-12 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
              주소 검색
            </button>
          </div>
          <TextInput
            id="mbrAddr"
            name="mbrAddr"
            value={form.mbrAddr}
            readOnly
            placeholder="기본 주소"
          />
          <TextInput
            id="mbrDaddr"
            name="mbrDaddr"
            value={form.mbrDaddr}
            onChange={handleChange}
            placeholder="상세 주소를 입력하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            id="mbrAuthCd"
            name="mbrAuthCd"
            label="권한"
            value={form.mbrAuthCd}
            onChange={handleChange}
            options={[
              { value: 'ROLE_USER', label: '일반회원' },
              { value: 'ROLE_ADMIN', label: '관리자' }
            ]}
          />
          <SelectInput
            id="mbrUseYn"
            name="mbrUseYn"
            label="계정 상태"
            value={form.mbrUseYn}
            onChange={handleChange}
            options={[
              { value: 'Y', label: '활성' },
              { value: 'N', label: '정지/탈퇴' }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => navigate('/admin/members')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0F9B73] text-white rounded-lg font-semibold hover:bg-[#0d8a66] transition"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMemberEdit;