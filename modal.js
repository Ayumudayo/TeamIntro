import { db } from './firebase.js';
import { doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

let currentEditCard = null;

// 멤버 정보 모달 표시 시 데이터 설정
$("#memberInfoModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var card = button.closest(".card");
    currentEditCard = card;
    var image = card.find(".card-img-top").attr("src");
    var name = card.find(".card-title").text();
    var role = card.find(".card-text").text();

    $("#memberInfoModalLabel").text(name);
    $("#info-modal-image").attr("src", image);
    $("#info-modal-role").text(`직책: ${role}`);
    $("#info-modal-intro").text(`${card.data("intro")}`);
    $("#info-modal-github").text(
        `깃허브 주소: ${card.data("github") || "아직 등록되지 않았습니다."}`
    );
    $("#info-modal-favorite").text(
        `좋아하는 것: ${card.data("favorite") || "아직 등록되지 않았습니다."}`
    );
    $("#info-modal-mbti").text(
        `MBTI: ${card.data("mbti") || "아직 등록되지 않았습니다."}`
    );
    $("#info-modal-blog").text(
        `blog: ${card.data("blog") || "아직 등록되지 않았습니다."}`
    );
});

// 수정 버튼 클릭 시 수정 모달 표시
$("#editbtn").click(function () {
    $("#memberInfoModal").modal("hide");
    var card = currentEditCard;
    var image = card.find(".card-img-top").attr("src");
    var name = card.find(".card-title").text();
    var role = card.find(".card-text").text();
    var intro = card.data("intro");
    var github = card.data("github");
    var mbti = card.data("mbti");
    var favorite = card.data("favorite");
    var blog = card.data("blog");

    $("#modal-image-input").val(image);
    $("#modal-name-input").val(name);
    $("#modal-role-input").val(role);
    $("#modal-intro-input").val(intro);
    $("#modal-github-input").val(github);
    $("#modal-mbti-input").val(mbti);
    $("#modal-favorite-input").val(favorite);
    $("#modal-blog-input").val(blog);

    $("#memberEditModal").modal("show");
});

// 멤버 수정 모달 저장 버튼 클릭 시 Firestore 업데이트
$("#save-modal-btn").click(async function () {
    try {
        let id = currentEditCard.data("id");
        let image = $("#modal-image-input").val();
        let name = $("#modal-name-input").val();
        let role = $("#modal-role-input").val();
        let intro = $("#modal-intro-input").val();
        let github = $("#modal-github-input").val();
        let favorite = $("#modal-favorite-input").val();
        let blog = $("#modal-blog-input").val();
        let mbti = $("#modal-mbti-input").val();

        let docRef = doc(db, "meminfo", id);
        await updateDoc(docRef, {
            image: image,
            name: name,
            role: role,
            intro: intro,
            github: github,
            mbti: mbti,
            favorite: favorite,
            blog: blog,
        });

        currentEditCard.find(".card-img-top").attr("src", image);
        currentEditCard.find(".card-title").text(name);
        currentEditCard.find(".card-text").text(role);
        currentEditCard.data("intro", intro);
        currentEditCard.data("mbti", mbti);
        currentEditCard.data("blog", blog);
        currentEditCard.data("favorite", favorite);
        currentEditCard.data("github", github);

        $("#memberEditModal").modal("hide");
        alert("수정 완료");
    } catch (error) {
        console.error("수정 실패:", error);
        alert("수정 실패");
    }
});

// 삭제하기
$("#delbtn").click(async function () {
    if (confirm("삭제하시겠습니까?") == true) {
        const id = currentEditCard.data("id"); // 현재 카드의 ID 가져오기

        try {
            // 파이어베이스에서 데이터 삭제
            await deleteDoc(doc(db, "meminfo", id));

            // 웹에서 카드 제거 (CSS 별명 넣기)
            currentEditCard.closest(".col").remove();
            $("#memberInfoModal").modal("hide");
            alert("삭제 완료!");
        } catch (error) {
            console.error("Error removing document: ", error);
            alert("삭제 실패");
        }
    } else {
        alert("취소하였습니다.");
    }
});
