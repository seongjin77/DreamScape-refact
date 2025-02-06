import React, { useContext, useEffect, useRef } from 'react';
import { ModalSetterContext, ModalStateContext } from '../../context/ModalProvider';
import { createPortal } from 'react-dom';
import { ModalContainerStyle } from './Styled';
import { useDeviceType } from '../../hooks/useDeviceType';

const ModalContainer = () => {
  const modalList = useContext(ModalStateContext);
  const setModalList = useContext(ModalSetterContext);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { deviceType } = useDeviceType();

  const closeModalList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && modalRef.current) {
      modalRef.current.classList.remove('open');
      modalRef.current.classList.add('close'); // 애니메이션 클래스 추가

      setTimeout(() => {
        setModalList([]);
      }, 300); // 애니메이션 지속 시간에 맞춰 모달 제거
    }
  };

  useEffect(() => {
    if (modalList.length > 0) {
      // 🔹 모달이 열릴 때 스크롤 차단
      document.body.style.overflow = 'hidden';

      if (modalRef.current) {
        modalRef.current.classList.add('close'); // 초기에 close 클래스를 추가

        setTimeout(() => {
          modalRef.current?.classList.remove('close');
          modalRef.current?.classList.add('open'); // 모달이 렌더링된 후 open 클래스를 추가
        }, 10); // 10ms 딜레이로 자연스럽게 적용
      }
    } else {
      // 🔹 모달이 닫힐 때 원래 상태로 복구
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalList.length]);

  // 모달 리스트가 비어 있으면 아무것도 렌더링하지 않음
  if (modalList.length === 0) {
    return null;
  }

  return createPortal(
    <ModalContainerStyle ref={modalRef} onClick={closeModalList} deviceType={deviceType}>
      {modalList.map((modal) => (
        <div
          className={modal?.isClosing ? 'closeIndividualModal' : ''}
          key={modal.id}
          onClick={closeModalList}
        >
          {modal.component}
        </div>
      ))}
    </ModalContainerStyle>,
    document.getElementById('modal-root') as HTMLElement,
  );
};

export default ModalContainer;
