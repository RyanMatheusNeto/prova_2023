import { useLocation, useNavigate } from 'react-router-dom'
import { Auction } from '../../models/Auction'
import styles from './styles.module.css'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Bid } from '../../models/Bid'
import BidCard from '../../components/BidCard'
import { SocketContext } from '../../context/SocketContext'

type Location = {
  state: {
    auction: Auction
  }
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const LiveAuction = () => {
  const location: Location = useLocation()
  const navigate = useNavigate() // useNavigate em vez de useHistory
  const { auction } = location.state

  const [bids, setBids] = useState<Bid[]>([])
  const bottomEl = useRef<HTMLDivElement>(null)
  const { socket } = useContext(SocketContext)
  const [tempo, setTempo] = useState(auction.tempMax * 60); // Aqui está a constante 'tempo' que recebe o valor de 'tempMax' convertido para segundos
  const[valorInit, setValorInit] = useState(auction.initialBid.toLocaleString
    ('pt-br', {style: 'currency', currency: 'BRL'}))
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastBidTime = useRef(Date.now());

  useEffect(() => {
    if (tempo > 0) {
      const intervalo = setInterval(() => {
        setTempo(tempoAnterior => tempoAnterior - 1);
      }, 1000);
      return () => clearInterval(intervalo);
    } else {
      console.log('Cronômetro concluído');
    }
  }, [tempo]);

  const handleMessageReceived = useCallback((messageObj: Bid) => {
    console.log('Message received');
    console.log(messageObj);

    const updatedBids = [...bids, messageObj];
    setBids(updatedBids);
    lastBidTime.current = Date.now(); // Atualiza o tempo do último lance

    // Limpa o timeout anterior
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Inicia um novo timeout / terminar essa função
    timeoutId.current = setTimeout(() => {
      const timeSinceLastBid = Date.now() - lastBidTime.current;
      if (timeSinceLastBid >= 30000) { // 30 segundos
        // Se nenhum lance foi feito dentro de 10 segundos, finaliza o leilão
        console.log('Leilão cancelado');
        socket.emit('Leilão cancelado', { message: 'Nenhum lance foi feito dentro de 30 segundos' });
        window.alert('Leilão cancelado');
      }
    }, 10000);
  }, [bids]);

  socket.on(`${process.env.REACT_APP_MESSAGE_RECEIVED_EVENT}`, handleMessageReceived)

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bids])

  const handleBackClick = () => {
    navigate('/') // navigate em vez de history.push
  }

  return (
    <div className={styles.container}>

      <h1 className={styles.auctionTitle}>Leilão ao vivo do item "{auction.title}"</h1>
      <h1>{formatTime(tempo)}</h1>
      <h1>{(valorInit)}</h1>

      <div id='scroll-area' className={styles.liveAuctionArea}>
        {[...bids].sort((a, b) => a.value - b.value).map((b, index) => <BidCard key={index} bid={b} />)}
        <div ref={bottomEl}></div>

      </div>
        
      <input type="submit" value="Voltar tela de inicio " onClick={handleBackClick} /*arrumar depois porque esse 
      botão só deve ser exibido assim que o leilão ser encerrado*//>

    </div>
  )
}

export default LiveAuction
