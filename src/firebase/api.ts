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
const OUTPUT_MIME_TYPE = 'image/webp';

/**
 * 외부 이미지 URL을 Firebase에 업로드하는 함수
 */
async function uploadImageFromUrl(
  imageUrl: string,
  description: string,
  title: string,
  prompt: string,
  postpassword: string,
) {
  try {
    if (!imageUrl || !description || !title || !prompt || !postpassword) {
      throw new Error('이미지 URL, 제목, 설명, 비밀번호를 모두 입력해주세요.');
    }

    // 1. 원본 이미지 정보 확인을 위해 헤더만 가져오기
    const headResponse = await fetch(imageUrl, { method: 'HEAD' });

    if (!headResponse.ok) {
      throw new Error('이미지를 가져올 수 없습니다.');
    }

    // Content-Type과 Content-Length 확인 (가능한 경우)
    const contentType = headResponse.headers.get('Content-Type') || '';
    const contentLength = headResponse.headers.get('Content-Length');
    const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

    // 파일 크기 검증 (Content-Length가 있는 경우)
    if (fileSize > 0 && fileSize > MAX_FILE_SIZE) {
      throw new Error('파일 크기가 너무 큽니다.');
    }

    // MIME 타입 검증 (Content-Type이 있는 경우)
    if (contentType && !ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new Error('허용되지 않은 파일 형식입니다.');
    }

    // 2. weserv.nl CDN을 사용하여 WebP로 변환
    const webpUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&output=webp&q=85`;

    // 3. 변환된 WebP 이미지 가져오기
    const webpResponse = await fetch(webpUrl);

    if (!webpResponse.ok) {
      throw new Error('WebP 변환에 실패했습니다.');
    }

    const webpBlob = await webpResponse.blob();

    // 변환된 이미지 크기 확인
    if (webpBlob.size > MAX_FILE_SIZE) {
      throw new Error('변환된 파일 크기가 너무 큽니다.');
    }

    // 4. Firebase Storage에 업로드
    const fileName = `images/${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, webpBlob, { contentType: OUTPUT_MIME_TYPE });

    const downloadUrl = await getDownloadURL(storageRef);

    // 5. Firestore에서 마지막 순번 가져오기
    const imagesRef = collection(db, 'images');
    const lastImageQuery = query(imagesRef, orderBy('id', 'desc'), limit(1));
    const lastImageSnapshot = await getDocs(lastImageQuery);

    let newId = 1; // 기본 순번
    if (!lastImageSnapshot.empty) {
      const lastDoc = lastImageSnapshot.docs[0];
      const lastId = lastDoc.data().id;
      newId = lastId + 1; // 마지막 순번에 +1
    }

    // 6. Firestore에 데이터 저장
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

    return { success: true, id: newId, url: downloadUrl };
  } catch (error) {
    console.error('이미지 업로드 실패:', (error as Error).message);
    throw error;
  }
}

export { uploadImageFromUrl };
