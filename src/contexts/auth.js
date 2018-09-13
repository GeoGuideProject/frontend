import React from "react";

export const AuthContext = React.createContext({
  isAuthenticated: false,
  currentUser: {},
  onLogin: ({ accessToken }) => {},
  onLogout: () => {}
});
