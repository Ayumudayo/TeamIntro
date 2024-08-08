import { fetchMembers, saveMember, updateMember, deleteMember } from './member-functions.js';

$(document).ready(async function () {
    const members = await fetchMembers();

    // 정렬된 데이터를 기반으로 카드 생성 및 배치
    members.forEach((member) => {
        let newCard = `
            <div class="col">
                <div class="card h-100" data-bs-toggle="modal" data-bs-target="#memberInfoModal" data-id="${member.id}" data-intro="${encodeURIComponent(member.intro)}" data-github="${member.github}" data-blog="${member.blog}" data-favorite="${member.favorite}" data-mbti="${member.mbti}">
                    <div class="card-img-wrapper">
                        <img src="${member.image}" class="card-img-top" alt="멤버 이미지">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${member.name}</h5>
                        <p class="card-text">${member.role}</p>
                    </div>
                </div>
            </div>
        `;
        $("#card").append(newCard);
    });
});

let currentEditCard = null;

// 멤버 정보 모달 표시 시 데이터 설정
$("#memberInfoModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var card = button.closest(".card");
    currentEditCard = card;
    var image = card.find(".card-img-top").attr("src");
    var name = card.find(".card-title").text();
    var role = card.find(".card-text").text();
    var intro = decodeURIComponent(card.data("intro"));
    var github = card.data("github");
    var favorite = card.data("favorite");
    var blog = card.data("blog");
    var mbti = card.data("mbti");

    $("#memberInfoModalLabel").text(name);
    $("#info-modal-image").attr("src", image);
    $("#info-modal-role").text(`${role}`);
    $("#info-modal-intro").html(intro.replace(/\n/g, '<br>'));  // 줄바꿈을 <br>로 변환하여 표시
    $("#info-modal-favorite").text(`${favorite}`);
    $("#info-modal-mbti").text(`${mbti}`);
    $("#info-modal-github").attr("href", github || "#").text(github ? "GitHub" : "GitHub 등록되지 않음");
    $("#info-modal-blog").attr("href", blog || "#").text(blog ? "Blog" : "Blog 등록되지 않음");
});

// 수정 버튼 클릭 시 수정 모달 표시
$("#editbtn").click(function () {
    $("#memberInfoModal").modal("hide");
    var card = currentEditCard;
    var image = card.find(".card-img-top").attr("src");
    var name = card.find(".card-title").text();
    var role = card.find(".card-text").text();
    var intro = decodeURIComponent(card.data("intro"));
    var github = card.data("github");
    var favorite = card.data("favorite");
    var blog = card.data("blog");
    var mbti = card.data("mbti");

    $("#modal-image-input").val(image);
    $("#modal-name-input").val(name);
    $("#modal-role-input").val(role);
    $("#modal-intro-input").val(intro);
    $("#modal-github-input").val(github);
    $("#modal-favorite-input").val(favorite);
    $("#modal-blog-input").val(blog);
    $("#modal-mbti-input").val(mbti);

    $("#memberEditModal").modal("show");
});

// 멤버 추가 버튼 클릭 시 입력 폼 표시
$("#addbtn").click(function () {
    $("#postingbox").toggle();
});

// 멤버 추가 저장 버튼 클릭 시 Firestore에 저장
$("#savebtn").click(async function () {
    try {
        let member = {
            image: $("#image").val(),
            name: $("#name").val(),
            role: $("#role").val(),
            intro: $("#intro").val(), // textarea의 value 가져오기
            github: $("#github").val(),
            favorite: $("#favorite").val(),
            blog: $("#blog").val(),
            mbti: $("#mbti").val(),
        };

        await saveMember(member);
        alert("저장 완료");
        window.location.reload();
    } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 실패");
    }
});

// 멤버 수정 모달 저장 버튼 클릭 시 Firestore 업데이트
$("#save-modal-btn").click(async function () {
    try {
        let id = currentEditCard.data("id");
        let member = {
            image: $("#modal-image-input").val(),
            name: $("#modal-name-input").val(),
            role: $("#modal-role-input").val(),
            intro: $("#modal-intro-input").val(), // textarea의 value 가져오기
            github: $("#modal-github-input").val(),
            favorite: $("#modal-favorite-input").val(),
            blog: $("#modal-blog-input").val(),
            mbti: $("#modal-mbti-input").val(),
        };

        await updateMember(id, member);

        currentEditCard.find(".card-img-top").attr("src", member.image);
        currentEditCard.find(".card-title").text(member.name);
        currentEditCard.find(".card-text").text(member.role);
        currentEditCard.data("intro", encodeURIComponent(member.intro)); // 줄바꿈 처리하여 데이터 저장
        currentEditCard.data("mbti", member.mbti);
        currentEditCard.data("blog", member.blog);
        currentEditCard.data("favorite", member.favorite);
        currentEditCard.data("github", member.github);

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
            await deleteMember(id);

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
