import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getCompany } from "../services/companyService";
import { getProfile } from "../services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {

    async function loadUserData(session) {

      if (!session) {
        setUser(null);
        setCompany(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const currentUser = session.user;

      setUser(currentUser);

      const [{ data: company }, { data: profile }] =
        await Promise.all([
          getCompany(currentUser.id),
          getProfile(currentUser.id),
        ]);

      setCompany(company);
      setProfile(profile);

      setLoading(false);

    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadUserData(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {

      setSession(session);

      loadUserData(session);

    });

    return () => subscription.unsubscribe();

  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };
  if (loading) {
    return null;
  }
  async function loadCompany(userId) {
    if (!userId) {
      setCompany(null);
      return;
    }

    const { data } = await getCompany(userId);
    setCompany(data);
  }

  const refreshCompany = async () => {
  if (!user) return;

  const { data } = await getCompany(user.id);
  setCompany(data);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        company,
        profile,
        logout,
        refreshCompany,
        loadCompany,

        setCompany,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}