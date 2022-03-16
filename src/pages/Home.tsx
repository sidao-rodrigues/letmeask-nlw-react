import { useNavigate } from 'react-router-dom';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
import { FormEvent, useState } from 'react';
import { database } from '../service/firebase';

export function Home() {

  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handlerCreateRoom() {
    if(!user) {
      await signInWithGoogle();
    }
    navigate('/rooms/new');
  }

  async function handlerJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }
    if(roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }
    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração simbolizando pergunta e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />
          <button onClick={handlerCreateRoom} className="create-room">
            <img src={GoogleImg} alt="Logo do google" />
            Crie sua sala com google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handlerJoinRoom}>
            <input type="text" placeholder="Digite o código da sala" onChange={event => setRoomCode(event.target.value)} value={roomCode}/>
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}