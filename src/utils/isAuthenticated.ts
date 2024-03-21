const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== undefined && token !== null;
};

export default isAuthenticated;
