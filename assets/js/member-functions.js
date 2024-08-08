import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export async function fetchMembers() {
    const querySnapshot = await getDocs(collection(db, "meminfo"));
    let members = [];

    // Firestore에서 데이터를 가져와 배열에 저장
    querySnapshot.forEach((doc) => {
        let member = doc.data();
        member.id = doc.id; // id를 데이터에 포함
        members.push(member);
    });

    // 팀장 먼저, 그 다음 이름 오름차순으로 정렬
    members.sort((a, b) => {
        if (a.role === "팀장" && b.role !== "팀장") return -1;
        if (a.role !== "팀장" && b.role === "팀장") return 1;
        return a.name.localeCompare(b.name, 'ko');
    });

    return members;
}

export async function saveMember(member) {
    await addDoc(collection(db, "meminfo"), member);
}

export async function updateMember(id, member) {
    let docRef = doc(db, "meminfo", id);
    await updateDoc(docRef, member);
}

export async function deleteMember(id) {
    await deleteDoc(doc(db, "meminfo", id));
}
