import { useLocation } from 'react-router-dom'
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
  const { auction } = location.state

  const [bids, setBids] = useState<Bid[]>([])
  const bottomEl = useRef<HTMLDivElement>(null)
  const { socket } = useContext(SocketContext)
  const [tempo, setTempo] = useState(60);

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
    console.log('Message received')
    console.log(messageObj)

    const updatedBids = [...bids, messageObj]
    setBids(updatedBids)
  }, [bids])

  socket.on(`${process.env.REACT_APP_MESSAGE_RECEIVED_EVENT}`, handleMessageReceived)

  useEffect(() => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bids])

  return (
    <div className={styles.container}>

      <h1 className={styles.auctionTitle}>Leilão ao vivo do item "{auction.title}"</h1>
      <h1>{formatTime(tempo)}</h1>


      <div id='scroll-area' className={styles.liveAuctionArea}>
        {bids.map((b, index) => <BidCard key={index} bid={b} />)}
        <div ref={bottomEl}></div>

      </div>


    </div>
  )
}

export default LiveAuction
