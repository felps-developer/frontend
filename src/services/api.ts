import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'http://localhost:8080', // URL base da sua API
    timeout: 1000000, // Tempo limite para as requisições
});

// Função para estimar a viagem
export const estimateRide = async (userId: string, origem: string, destino: string) => {
    try {
        const response = await api.post('/ride/estimate', {
            customer_id: userId,
            origin: origem,
            destination: destino,
        });

        // Supondo que a resposta da API contenha as informações necessárias
        const { origin, destination, distance, duration, options, value } = response.data;


        return {
            customer_id: userId,
            origin,
            destination,
            distance,
            duration,
            options, // driver deve ter id e name
            value,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.error_description || 'Erro ao estimar a viagem.');
    }
};

export const confirmRide = async (
    customer_id: string,
    origem: string,
    destino: string,
    distance: number,
    duration: string,
    driver: { id: number, name: string }, // Passa o objeto driver com id e name
    driverValue: number
) => {
    try {

        const response = await api.patch('/ride/confirm', {
            customer_id,
            origin: origem,
            destination: destino,
            distance,
            duration,
            driver,
            value: driverValue,
        });

        return response.data;
    } catch (error: any) {
        console.error('Erro ao confirmar a viagem:', error);
        throw new Error(error.response?.data?.error_description || 'Erro ao confirmar a viagem.');
    }
};

// Função para buscar o histórico de viagens
export const fetchTripHistory = async (customer_id: string, motoristaId?: number) => {
    try {
        const queryParams = new URLSearchParams({
            customer_id: customer_id,
            ...(motoristaId && { id_motorista: motoristaId.toString() }),
        });
        const response = await api.get(`/ride?${queryParams.toString()}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error_description || 'Erro ao buscar o histórico de viagens.');
    }
};
