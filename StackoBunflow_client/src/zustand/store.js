import { create } from 'zustand';


export const indexStore = create((set)=> ({
    userIndex : 0,
    setUserIndex : (index) => set((state)=> ({ userIndex : index })),
    removeUserIndex : () => set((state)=> ({ userIndex : 0 }))
}));