import Swal from 'sweetalert2';

// 1. 기본 설정을 담은 베이스 인스턴스
const ToastBase = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

/**
 * Swal Toast 사용
 * @used toast({ icon: 'success', title: '성공했습니다!' });
 * @used toast({ icon: 'error', html: '실패했습니다!<br/>관리자 문의', position: 'top-center', timer: 3000 });
 * 
 * @param {Object} options 
 * @param {string} options.icon - 'success', 'error', 'warning', 'info', 'question'
 * @param {string} [options.title] - 일반 텍스트 메시지
 * @param {string} [options.html] - HTML 태그가 포함된 메시지 (br 태그 등 사용 시)
 * @param {string} [options.position='bottom-end'] - 위치 설정 (기본값 bottom-end)
 * @param {number} [options.timer=1500] - 지속 시간 (기본값 1500ms)
 */
export const toast = ({ 
  icon, 
  title, 
  html,
  position = 'bottom-end', 
  timer = 1500 
}) => {
  return ToastBase.fire({
    icon,
    title,
    html,
    position,
    timer
  });
};


/**
 * Swal Confirm 사용
 * @used const isConfirmed = await confirm({ title: '정말 탈퇴하시겠습니까?', text: '삭제된 데이터는 복구할 수 없습니다.' });
 * 
 * @param {Object} options 
 * @param {string} options.title - 제목
 * @param {string} options.text - 상세 설명
 * @param {string} [options.icon='warning'] - 아이콘
 * @param {string} [options.confirmButtonText='확인'] - 확인 버튼 텍스트
 * @param {string} [options.cancelButtonText='취소'] - 취소 버튼 텍스트
 */
export const confirm = async ({ 
  title, 
  text, 
  icon = 'warning', 
  confirmButtonText = '확인', 
  cancelButtonText = '취소' 
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#d33', // 프로젝트 메인 컬러에 맞춰 수정 가능
    cancelButtonColor: '#0F9B73',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true, // 취소-확인 순서로 배치 (브라우저 표준 느낌)
  });

  return result.isConfirmed; // 확인을 눌렀으면 true, 아니면 false 반환
};


// 1. 매핑 정의서 (확장성을 위해 외부에 정의하거나 함수 내부에 배치)
const fieldMap = {
    // 회원 정보
    'profile': {
        mbrId: 'id',
        mbrProviderCd: 'loginType',
        mbrName: 'name',
        mbrNickname: 'nickname',
        mbrTelno: 'phone',
        mbrEmail: 'email',
        mbrZip: 'zipcode',
        mbrAddr: 'address',
        mbrDaddr: 'detailAddress',
        mbrProfileIcon: 'profileIcon',
        mbrProfileBg: 'profileBg'
    },
    // 나중에 'product'나 'order' 등 다른 매핑이 필요하면 여기에 추가
};

/**
 * @param {string} type - fieldMap에서 사용할 키 (예: 'profile')
 * @param {Object} updatedData - 서버에서 받은 데이터
 * @param {Object} profileState - (선택) 현재 리액트의 profile 상태값
 */
export const mapDataToState = (type, updatedData, profileState = {}) => {
    if (!updatedData) return profileState;

    // 정의서에서 해당 타입의 규칙을 가져옴
    const mapping = fieldMap[type];
    if (!mapping) {
        console.warn(`fieldMap에 '${type}' 정의가 없습니다.`);
        return { ...profileState, ...updatedData }; // 규칙 없으면 그냥 합침
    }

    // 기존 상태가 있으면 복사, 없으면 빈 객체로 시작 (불변성)
    const result = profileState ? { ...profileState } : {};

    // 서버 데이터의 키를 순회하며 매핑 규칙 적용
    Object.keys(updatedData).forEach((serverKey) => {
        const frontKey = mapping[serverKey];
        const value = updatedData[serverKey];

        if (frontKey) {
            // 규칙에 있는 키라면 프론트용 키 이름으로 저장
            result[frontKey] = value;
        } else {
            // 규칙엔 없지만 기존 객체에 이미 존재하는 키라면 업데이트
            if (Object.prototype.hasOwnProperty.call(result, serverKey)) {
                result[serverKey] = value;
            }
        }
    });

    // 날짜 포맷팅 같은 공통 처리 (옵션)
    if (updatedData.mbrJoinDate) { result.joinDate = updatedData.mbrJoinDate.split('T')[0]; }

    // 프로필 이미지 캐시 방지 처리
    if (updatedData.mbrProfileInfo?.filePath) { result.profileIcon.filePath += `?t=${new Date().getTime()}`; }

    return result;
};