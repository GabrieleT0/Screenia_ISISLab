import { useState } from 'react';
import { useRecoilState } from 'recoil';
import loaderAtom from '../../state/loader/loaderAtom';

const useLoader = () => {
  const [isOpenLoader, setIsOpenLoeader] = useRecoilState(loaderAtom);

  function setLoader() {
    setIsOpenLoeader(isOpenLoader => !isOpenLoader);
  }

  return {
    isOpenLoader,
    setLoader,
  }
};

export default useLoader;