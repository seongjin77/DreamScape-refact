import { storage, db } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

async function uploadImageFromUrl(
  imageUrl: string,
  description: string,
  title: string,
  prompt: string,
  postpassword: string, // 🔹 postpassword 사용
) {
  try {
    if (!imageUrl || !description || !title || !prompt || !postpassword) {
      throw new Error('이미지 URL, 제목, 설명, 비밀번호를 모두 입력해주세요.');
    }

    // 1. 이미지 URL의 데이터를 가져오기
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('이미지를 가져올 수 없습니다.');
    }

    const imageBlob = await response.blob();

    const fileSize = imageBlob.size;
    const fileType = imageBlob.type;

    if (fileSize > MAX_FILE_SIZE) {
      throw new Error('파일 크기가 너무 큽니다.');
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      throw new Error('허용되지 않은 파일 형식입니다.');
    }

    // 2. Firebase Storage에 업로드
    const fileName = `images/${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, imageBlob, { contentType: fileType });

    const downloadUrl = await getDownloadURL(storageRef);

    // 3. Firestore에서 마지막 순번 가져오기
    const imagesRef = collection(db, 'images');
    const lastImageQuery = query(imagesRef, orderBy('id', 'desc'), limit(1));
    const lastImageSnapshot = await getDocs(lastImageQuery);

    let newId = 1; // 기본 순번
    if (!lastImageSnapshot.empty) {
      const lastDoc = lastImageSnapshot.docs[0];
      const lastId = lastDoc.data().id;
      newId = lastId + 1; // 마지막 순번에 +1
    }

    // 4. Firestore에 데이터 저장
    const imageDoc = {
      id: newId, // 순번 ID
      description,
      title,
      prompt,
      postpassword,
      url: downloadUrl,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(imagesRef, String(newId)), imageDoc);
  } catch (error) {
    console.error('이미지 업로드 실패:', (error as Error).message);
  }
}

export { uploadImageFromUrl };
