import { create } from "zustand";

const useAuthStore = create((set) => ({
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,


  login: (data) => {

    localStorage.setItem(
      "access",
      data.access
    );

    localStorage.setItem(
      "refresh",
      data.refresh
    );


    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );


    set({
      access:data.access,
      refresh:data.refresh,
      user:data.user
    });
  },


  logout: () => {

    localStorage.clear();

    set({
      access:null,
      refresh:null,
      user:null
    });

  }

}));


export default useAuthStore;