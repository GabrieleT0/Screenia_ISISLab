import { atom } from "recoil"

const userAtom = atom({
    key: 'userAtom',
    default: JSON.parse(localStorage.getItem('user')) || null, 
    effects_UNSTABLE: [
        ({ onSet }) => {
          onSet((newUser) => {
            if (newUser) {
              localStorage.setItem('user', JSON.stringify(newUser));
            } else {
              localStorage.removeItem('user');
            }
          });
        },
    ],
});

export { 
    userAtom
};