import Swal from "sweetalert2";
import api from "@api/axios";

export const openReportModal = async ({
  type = "post",
  commNo = null,
  cmntNo = null,
  reviewNo = null,
} = {}) => {
  const isComment = type === "comment";
  const isReview = type === "review";

  const name = isComment ? "report-comment" : isReview ? "report-review" : "report";
  const etcWrap = isComment
    ? "etc-comment-input-wrap"
    : isReview
    ? "etc-review-input-wrap"
    : "etc-input-wrap";
  const etcInput = isComment
    ? "etc-comment-input"
    : isReview
    ? "etc-review-input"
    : "etc-input";

  const firstText = isComment
    ? "부적절한 댓글로 인한 신고"
    : isReview
    ? "부적절한 리뷰로 인한 신고"
    : "부적절한 게시글로 인한 신고";

  const rptTypeCd = isComment ? "RPT003" : isReview ? "RPT001" : "RPT002";

  const result = await Swal.fire({
    title: "신고 사유를 선택해주세요",

    html: `
      <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">

        <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
          <input type="radio" name="${name}" value="${firstText}" data-code="RSN002" style="accent-color:#f97316;" />
          ${firstText}
        </label>

        <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
          <input type="radio" name="${name}" value="불법 광고 및 홍보 인한 신고" data-code="RSN001" style="accent-color:#f97316;" />
          불법 광고 및 홍보 인한 신고
        </label>

        <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
          <input type="radio" name="${name}" value="기타" data-code="RSN003"
            style="accent-color:#f97316;"
            onclick="document.getElementById('${etcWrap}').style.display='block'" />
          기타
        </label>

        <div id="${etcWrap}" style="display:none; margin-top:4px;">
          <textarea id="${etcInput}"
            placeholder="기타 신고 내용을 입력해주세요."
            style="width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px;"></textarea>
        </div>

      </div>
    `,

    showCancelButton: true,
    confirmButtonText: "신고하기",
    cancelButtonText: "취소",
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#9ca3af",

    preConfirm: () => {
      const selected = document.querySelector(`input[name="${name}"]:checked`);

      if (!selected) {
        Swal.showValidationMessage("신고 사유를 선택해주세요.");
        return false;
      }

      const reasonCd = selected.dataset.code;
      let reasonContent = selected.value;

      if (selected.value === "기타") {
        const val = document.getElementById(etcInput)?.value?.trim();
        if (!val) {
          Swal.showValidationMessage("기타 내용을 입력해주세요.");
          return false;
        }
        reasonContent = val;
      }

      return {
        rptTypeCd,
        rptCommNo: commNo,
        rptCmntNo: cmntNo,
        rptReviewNo: reviewNo,
        rptReasonCd: reasonCd,
        rptReasonContent: reasonContent,
      };
    },
  });

  if (!result.isConfirmed) return;

  try {
  console.log("신고 전송 데이터:", result.value);

    const res = await api.post("/reports", result.value);

    const blinded = res.data;

    if (blinded) {

      await Swal.fire({
        icon: "success",
        title: "블라인드 처리 완료",
        text: "신고 누적으로 블라인드 처리되었습니다.",
        timer: 1500,
        showConfirmButton: false,
      });

      return {
        blinded: true,
      };
    }

    await Swal.fire({
      icon: "success",
      title: "신고 완료",
      text: "신고가 정상적으로 접수되었습니다.",
      timer: 1500,
      showConfirmButton: false,
    });

    return {
      blinded: false,
    };

  } catch (err) {
    console.error("신고 실패:", err);

    await Swal.fire({
      icon: "error",
      title: "신고 실패",
      text:
        err.response?.data?.message ||
        "신고 처리 중 문제가 발생했습니다.",
    });
  }
};