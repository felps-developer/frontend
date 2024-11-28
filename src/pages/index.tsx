import Head from 'next/head';
import styles from '../../styles/home.module.scss';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { estimateRide } from '../services/api';
import 'primeflex/primeflex.css';

export default function Home() {
  const [customer_id, setId_usuario] = useState('');
  const [origem, setOrigin] = useState('');
  const [destino, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Função para validar o endereço
  function isAddressValid(address: string): boolean {
    return /^[a-zA-Z0-9\s,.\-/]+$/.test(address);
  }

  async function handleEstimate(event: FormEvent) {
    event.preventDefault();

    if (!customer_id || !origem || !destino) {
      toast.warning('Preencha todos os campos!');
      return;
    }

    if (!isAddressValid(origem)) {
      toast.error('Endereço de origem inválido!');
      return;
    }

    if (!isAddressValid(destino)) {
      toast.error('Endereço de destino inválido!');
      return;
    }

    setLoading(true);

    try {
      const data = await estimateRide(customer_id, origem, destino);
    
      toast.success('Estimativa de viagem calculada com sucesso!');
      
      router.push({
        pathname: '/option',
        query: {
          data: JSON.stringify(data),
          customer_id,
          origem,
          destino
          
        }, // Enviando os dados para a próxima página

      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao calcular a estimativa de viagem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Solicitar Viagem</title>
      </Head>
      <div className={styles.containerCenter}>
        <h1 className="text-white">Solicitar Viagem</h1>
        <div className={styles.login}>
          <form onSubmit={handleEstimate}>
            <Input
              placeholder="Digite seu ID de usuário"
              type="text"
              value={customer_id}
              onChange={(e) => setId_usuario(e.target.value)}
            />
            <Input
              placeholder="Digite onde você está"
              type="text"
              value={origem}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <Input
              placeholder="Digite seu destino"
              type="text"
              value={destino}
              onChange={(e) => setDestination(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Calcular
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
