import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.reload();
  }, []);

  return null;
}

export default Logout;
