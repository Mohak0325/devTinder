import io from 'socket.io-client';
import { BASE_URL } from './constants';

export const createSocketConnection = () => {
    return io("http://localhost:7777");
}

// const socket = io("http://localhost:7777");

// export default socket;