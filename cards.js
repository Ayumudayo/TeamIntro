import { db } from './firebase.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

// Firestore에서 멤버 정보를 가져와 카드 생성
$(document).ready(async function () {
    const querySnapshot = await getDocs(collection(db, "meminfo"));
    querySnapshot.forEach((doc) => {
        const member = doc.data();
        let newCard = `
            <div class="col">
                <div class="card h-100" data-bs-toggle="modal" data-bs-target="#memberInfoModal" data-id="${doc.id}" data-intro="${member.intro}" data-github="${member.github}" data-blog="${member.blog}" data-favorite="${member.favorite}" data-mbti="${member.mbti}">
                    <img src="${member.image}" class="card-img-top" style="width: 100%; height: 300px; object-fit: cover;" alt="멤버 이미지">
                    <div class="card-body">
                        <h5 class="card-title">${member.name}</h5>
                        <p class="card-text">${member.role}</p>
                    </div>
                </div>
            </div>
        `;
        console.log(newCard);
        $("#card").append(newCard);
    });
});

// 멤버 추가 버튼 클릭 시 입력 폼 표시
$("#addbtn").click(function () {
    $("#postingbox").toggle();
});

// 멤버 추가 저장 버튼 클릭 시 Firestore에 저장
$("#savebtn").click(async function () {
    try {
        let image = $("#image").val();
        let name = $("#name").val();
        let role = $("#role").val();
        let intro = $("#intro").val();
        let github = $("#github").val();
        let favorite = $("#favorite").val();
        let blog = $("#blog").val();
        let mbti = $("#mbti").val();

        let doc = {
            image: image,
            name: name,
            role: role,
            intro: intro,
            mbti: mbti,
            blog: blog,
            favorite: favorite,
            github: github,
        };
        await addDoc(collection(db, "meminfo"), doc);
        alert("저장 완료");
        window.location.reload();
    } catch (error) {
        console.error("저장 실패:", error);
        alert("저장 실패");
    }
});
