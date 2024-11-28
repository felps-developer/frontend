import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { confirmRide } from '@/services/api';


type Driver = {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    rating: number;
    value: number;
    image?: string; // Adicionei suporte à imagem do motorista
};

export default function Options() {
    const router = useRouter();
    const { data, customer_id, origem, destino } = router.query;

    const [loading, setLoading] = useState(false);
    // Analise os dados passados pela query
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Verifique se parsedData contém os valores necessários
    const originCoordinates = parsedData?.origin || [];
    const destinationCoordinates = parsedData?.destination || [];
    const distance = parsedData?.distance || 0;
    const duration = parsedData?.duration || '';
    const drivers = parsedData?.options || [];
    
    
    // Verifica se os dados de origem e destino existem
    


    // Função para escolher um motorista e confirmar a viagem
    const handleChooseDriver = async (driver: Driver) => {
        setLoading(true);
        try {
            if (!origem || !destino || !customer_id) {
                throw new Error("Dados da viagem incompletos ou ausentes.");
            }
    
            // Confirmar a corrida com os dados necessários
            const response = await confirmRide(
                customer_id as string,
                origem as string,
                destino as string,
                distance,
                duration,
                { id: driver.id, name: driver.name },
                driver.value
            );
    
            toast.success("Viagem confirmada com sucesso!");
    
            // Redirecionar para o histórico com os dados necessários
            router.push({
                pathname: "/historico",
                query: {
                    customer_id,
                    driver: JSON.stringify(driver), // Motorista escolhido
                    trip: JSON.stringify(response), // Detalhes da corrida
                },
            });
        } catch (error) {
            toast.error("Erro ao confirmar a viagem!");
            console.error("Erro ao confirmar a viagem:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    const generateMapUrl = (origin: any, destination: any) => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Certifique-se de usar sua chave correta aqui
        if (!origin || !destination) return ''; // Verifica se os dados existem
        return `https://maps.googleapis.com/maps/api/staticmap?size=800x400&markers=color:red%7Clabel:A%7C${origin.latitude},${origin.longitude}&markers=color:blue%7Clabel:B%7C${destination.latitude},${destination.longitude}&path=color:0x0000ff|weight:5|${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}&key=${apiKey}`;
    };

    return (
        <>
            <Head>
                <title>Opções de Viagem</title>
            </Head>

            <div
                className="p-d-flex p-flex-column p-ai-center"
                style={{ backgroundColor: '#121212', color: '#FFFFFF', padding: '20px', minHeight: '100vh' }}
            >
                <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Opções de Viagem</h1>

                <div className="p-d-flex p-jc-center p-mb-4 flex justify-content-center " style={{ width: '100%' }}>
                    <img
                        src={generateMapUrl(originCoordinates, destinationCoordinates)}
                        alt="Mapa da Rota"
                        className='justify'
                        style={{
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '800px',
                            height: 'auto',
                            display: generateMapUrl(originCoordinates, destinationCoordinates) ? 'block' : 'none',
                        }}
                    />
                </div>

                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Escolha um Motorista</h3>

                <div className="p-grid p-jc-center p-ai-center flex justify-content-center " style={{ width: '100%', gap: '1rem' }}>
                    {drivers.map((driver: Driver) => (
                        <div
                            key={driver.id}
                            className="p-card p-shadow-4"
                            style={{
                                maxWidth: '300px',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: '#1E1E1E',
                                textAlign: 'center',
                            }}
                        >
                            {driver.image && (
                                <img
                                    src={driver.image}
                                    alt={driver.name}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                            )}
                            <div className="p-card-content p-d-flex p-flex-column p-jc-between" style={{ height: '100%' }}>
                                {/* Conteúdo do Card */}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>{driver.name}</h4>
                                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>{driver.description}</p>
                                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                                        <strong>Veículo:</strong> {driver.vehicle}
                                    </p>
                                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                                        <strong>Avaliação:</strong> {driver.rating} ⭐
                                    </p>
                                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                                        <strong>Valor:</strong> R$ {driver.value.toFixed(2)}
                                    </p>
                                </div>

                                {/* Botão */}
                                <div style={{ marginTop: 'auto' }}>
                                    <Button
                                        label="Escolher"
                                        icon="pi pi-check"
                                        onClick={() => handleChooseDriver(driver)}
                                        loading={loading}
                                        className="p-button-success p-button-rounded"
                                        style={{
                                            width: '100%',
                                            padding: '10px 0',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-content-center mt-3  ">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        onClick={handleCancel}
                        className="p-button-secondary p-button-rounded p-mt-4"
                        style={{ width: '200px', fontSize: '16px', fontWeight: 'bold' }}
                    />
                </div>




            </div>
        </>
    );
}
