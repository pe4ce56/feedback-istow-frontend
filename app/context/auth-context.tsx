import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import Router, { useRouter } from "next/router";
import Cookies from "js-cookie";
import api from "../API";
import QueryString from "qs";

interface AppContextInterface {
  isAuthenticated: Boolean;
  user: object;
  loading: Boolean;
  login: Function;
  logout: Function;
  checkStatus: Function;
}

const AuthContext = createContext<AppContextInterface>({
  isAuthenticated: false,
  user: {},
  loading: false,
  checkStatus: () => { },
  login: () => { },
  logout: () => { },
} as unknown as AppContextInterface);


export const AuthProvider = ({ children }: any): JSX.Element => {
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    if (!router.pathname.includes("/admin")) return setLoading(false);
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      if (!token && router.pathname != "/admin/login")
        return router.push("/admin/login");
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await api
          .get(`users/check_token?token=${token}`)
          .then((res) => {
            if (res.data.status != 200) {
              return logout();
            }
          })
          .catch((e) => console.log(e));
        // const { data: user } = await api.get('users/me')
        if (user) setUser(user);
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = async (email: string, password: string) => {
    console.log(email, password);
    try {
      const { data: token, statusText } = await api.post(
        "token",
        QueryString.stringify({ username: email, password })
      );
      console.log(statusText);

      if (token.status != "failed") {
        Cookies.set("token", token.access_token, { expires: 3 });
        api.defaults.headers.common.Authorization = `Bearer ${token.access_token}`;
        setUser(token.user);
        console.log("Got user", token.user);
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser({});
    delete api.defaults.headers.common.Authorization;
    router.push("/admin/login");
  };

  const checkStatus = (res: any) => {
    if (res.status != "failed" && res.reason != "token expired") return true;
    logout();
    return false;
  };

  return (

    <AuthContext.Provider
      value={{
        isAuthenticated: isLogin,
        user,
        login,
        loading,
        logout,
        checkStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);

export interface AuthAbstract {
  user: Object;
  isAuthenticated: boolean;
  login: Function;
  logout: Function;
  checkStatus: Function;
}
