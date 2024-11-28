import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { fetchTripHistory } from "@/services/api"; // Função para buscar o histórico

const Historico = () => {
  const router = useRouter();
  const { customer_id } = router.query;

  const [viagens, setViagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState<string>("");
  const [motoristaId, setMotoristaId] = useState<number | null>(null);

  // Atualiza os motoristas únicos com base no histórico
  const parsedDrivers = viagens
    .map((viagem) => viagem.driver)
    .filter((driver, index, self) => driver && self.findIndex((d) => d.id === driver.id) === index);

  // Função para carregar as viagens com base nos filtros
  const loadViagens = async () => {
    if (!idUsuario) {
      toast.error("ID do usuário não foi informado!");
      return;
    }

    setLoading(true);
    try {

      const data = await fetchTripHistory(idUsuario, motoristaId);

      setViagens(data);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      toast.error("Erro ao buscar viagens. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer_id) {
      setIdUsuario(String(customer_id));
      loadViagens();
    }
  }, [customer_id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{color: "white"}}>Histórico de Viagens</h1>

      {/* Filtros */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>ID do Usuário:</label>
        <input
          type="text"
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          placeholder="Digite o ID do usuário"
          style={{ padding: "5px", marginBottom: "10px", width: "300px" }}
        />

        <label style={{ display: "block", marginBottom: "5px" }}>Filtrar por Motorista:</label>
        <select
          onChange={(e) => setMotoristaId(Number(e.target.value))}
          value={motoristaId || ""}
          style={{ padding: "5px", width: "300px", marginBottom: "10px" }}
        >
          <option value="">Todos os motoristas</option>
          {parsedDrivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        <button
          onClick={loadViagens}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Aplicar Filtro
        </button>
      </div>

      {/* Lista de viagens */}
      {loading ? (
        <p>Carregando...</p>
      ) : viagens.length === 0 ? (
        <p style={{color: "white"}}>Nenhuma viagem encontrada.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Data</th>
              <th style={tableHeaderStyle}>Motorista</th>
              <th style={tableHeaderStyle}>Origem</th>
              <th style={tableHeaderStyle}>Destino</th>
              <th style={tableHeaderStyle}>Distância</th>
              <th style={tableHeaderStyle}>Tempo</th>
              <th style={tableHeaderStyle}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {viagens.map((viagem) => (
              <tr key={viagem.id}>
                <td style={tableCellStyle}>
                  {viagem.date ? new Date(viagem.date).toLocaleString() : "N/A"}
                </td>
                <td style={tableCellStyle}>{viagem.driver?.name || "Desconhecido"}</td>
                <td style={tableCellStyle}>{viagem.origin || "N/A"}</td>
                <td style={tableCellStyle}>{viagem.destination || "N/A"}</td>
                <td style={tableCellStyle}>
                  {viagem.distance ? `${viagem.distance.toFixed(2)} km` : "N/A"}
                </td>
                <td style={tableCellStyle}>
                  {viagem.duration ? `${viagem.duration} min` : "N/A"}
                </td>
                <td style={tableCellStyle}>
                  {viagem.value !== undefined ? `R$ ${viagem.value.toFixed(2)}` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Voltar para Página Principal
      </button>
    </div>
  );
};

// Estilos para a tabela
const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left", // Valor específico permitido para 'textAlign'
  backgroundColor: "#f2f2f2",
};


const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  color: "white"
};

export default Historico;
