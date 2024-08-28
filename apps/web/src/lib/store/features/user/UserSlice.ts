import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string; 
  email: string;
  role: string;
  approved: boolean;
  noteId: string;
  isQCallAccessible: boolean;
  serviceAccessRoles: string[];
  image?: string|''  ; 
}

const initialState: UserState = {
  id: "",
  name: "", // Initial value set to 
  email: "",
  role: "USER",
  approved: false,
  noteId: "",
  isQCallAccessible: false,
  serviceAccessRoles: [],
  image:"" , 
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const user = action.payload;
      state.id = user.id;
      state.name = user.name;
      state.email = user.email;
      state.role = user.role;
      state.approved = user.approved;
      state.noteId = user.noteId;
      state.isQCallAccessible = user.isQCallAccessible;
      state.serviceAccessRoles = user.serviceAccessRoles;
      state.image = user.image ?? ""; // Fallback to  if undefined
    },
    clearUser: (state) => {
      state.id = "";
      state.name ="" ; // Set to  on clear
      state.email = "";
      state.role = "USER";
      state.approved = false;
      state.noteId = "";
      state.isQCallAccessible = false;
      state.serviceAccessRoles = [];
      state.image ="" ; // Set to  on clear
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: UserState) => state;

export default userSlice.reducer;
