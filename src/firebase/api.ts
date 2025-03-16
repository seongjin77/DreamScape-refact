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
 * 이미지 Blob을 WebP 형식으로 변환하는 함수
 */
async function convertToWebP(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageBlob);

    img.onload = () => {
      // 캔버스 생성 및 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // 이미지 처리가 끝났으므로 객체 URL 해제
      URL.revokeObjectURL(objectUrl);

      if (!ctx) {
        reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // WebP로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('WebP 변환에 실패했습니다.'));
          }
        },
        OUTPUT_MIME_TYPE,
        0.85, // 품질 설정
      );
    };

    img.onerror = () => {
      // 에러 발생 시에도 객체 URL 해제
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지 로드에 실패했습니다.'));
    };

    img.src = objectUrl;
  });
}

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

    // 1. 이미지 URL의 데이터를 가져오기
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('이미지를 가져올 수 없습니다.');
    }

    const imageBlob = await response.blob();

    // 파일 유효성 검사
    const fileSize = imageBlob.size;
    const fileType = imageBlob.type;

    if (fileSize > MAX_FILE_SIZE) {
      throw new Error('파일 크기가 너무 큽니다.');
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      throw new Error('허용되지 않은 파일 형식입니다.');
    }

    // 2. 이미지를 WebP로 변환
    const webpBlob = await convertToWebP(imageBlob);

    // 3. Firebase Storage에 업로드
    const fileName = `images/${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, webpBlob, { contentType: OUTPUT_MIME_TYPE });

    const downloadUrl = await getDownloadURL(storageRef);

    // 4. Firestore에서 마지막 순번 가져오기
    const imagesRef = collection(db, 'images');
    const lastImageQuery = query(imagesRef, orderBy('id', 'desc'), limit(1));
    const lastImageSnapshot = await getDocs(lastImageQuery);

    let newId = 1; // 기본 순번
    if (!lastImageSnapshot.empty) {
      const lastDoc = lastImageSnapshot.docs[0];
      const lastId = lastDoc.data().id;
      newId = lastId + 1; // 마지막 순번에 +1
    }

    // 5. Firestore에 데이터 저장
    const imageDoc = {
      id: newId,
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
    throw error; // 에러를 상위로 전파하여 호출자가 처리할 수 있도록 함
  }
}

export { uploadImageFromUrl };
