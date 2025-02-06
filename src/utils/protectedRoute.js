import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const protectedRoute = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    if (!isAuthenticated) {
      return <p>Loading...</p>;
    }
    return <WrappedComponent {...props} />;
  };
};

export default protectedRoute;