import { selector } from 'recoil';
import { userAtom } from './userAtom';

const selectorIsAuth = selector({
    key: 'selectorIsAuth',
    get: ({ get }) => {
      const user = get(userAtom);

      if(user && user.id) {
        return true;
      }
  
      return false;
    },
});

export {
    selectorIsAuth
}
