import { create } from 'zustand';

export const authStore = create((set)=> ({
    auth : '',
    setAuth : (token) => set((state)=> ({ auth : token })),
    removeAuth : () => set((state)=> ({ auth : '' })),
}))

export const indexStore = create((set)=> ({
    userIndex : 0,
    setUserIndex : (index) => set((state)=> ({ userIndex : index })),
    removeUserIndex : () => set((state)=> ({ userUndex : 0 }))
}));