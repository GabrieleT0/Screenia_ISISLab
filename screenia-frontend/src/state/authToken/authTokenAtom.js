import { atom } from "recoil";

const authTokenAtom = atom({
    key: 'authTokenAtom',
    default: localStorage.getItem('authToken'),
    effects_UNSTABLE: [
      ({ onSet }) => {
        onSet((newAuthToken) => {
          if (newAuthToken) {
            localStorage.setItem('authToken', newAuthToken);
          } else {
            localStorage.removeItem('authToken');
          }
        });
      },
    ],
});

export default authTokenAtom;