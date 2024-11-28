import { createContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { estimateRide } from '../services/api';

// Definindo o tipo do usuário
type UserProps = {
  id: string;
  origin: string;
  destination: string;
};

// Definindo o tipo do contexto com a propriedade 'user'
type AuthContextData = {
  user: UserProps | null; // user pode ser um objeto ou null caso o usuário não esteja logado
  requestRide: (id: string, origin: string, destination: string) => Promise<void>;
  login: (user: UserProps) => void; // Função para login do usuário
  logout: () => void; // Função para logout do usuário
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProps | null>(null); // Inicia com 'null', pois o usuário pode não estar logado

  // Carregar o usuário do sessionStorage (caso já tenha feito login anteriormente)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função de login
  const login = (user: UserProps) => {
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user)); // Armazena o usuário no sessionStorage
    toast.success("Usuário logado com sucesso!");
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    toast.success("Usuário deslogado com sucesso!");
    router.push("/login"); // Redireciona para a página de login
  };

  async function requestRide(id: string, origin: string, destination: string) {
    try {
      if (!user) {
        toast.error("Você precisa estar logado para fazer a solicitação.");
        router.push("/login"); // Caso o usuário não esteja logado, redireciona para a página de login
        return;
      }

      const data = await estimateRide(id, origin, destination); // Chamada à API para estimar a viagem
      toast.success("Estimativa de viagem calculada com sucesso!");

      // Armazena os dados em sessionStorage para maior segurança
      sessionStorage.setItem("tripData", JSON.stringify(data));

      // Redireciona para a página de opções de viagem
      router.push("/trip-options");
    } catch (error: any) {
      toast.error("Erro ao calcular a estimativa de viagem. Tente novamente.");
      console.error("Erro ao calcular a viagem:", error.message);
    }
  }

  return (
    <AuthContext.Provider value={{ user, requestRide, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
