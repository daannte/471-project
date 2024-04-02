import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.reload();
  }, []);

  return null;
}

export default Logout;
