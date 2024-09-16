import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

function Surveillance({ authToken }) {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('http://your-server-ip:5000', {
      auth: {
        token: authToken,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, [authToken]);

  useEffect(() => {
    if (socket) {
      // Initialize SimplePeer
      const newPeer = new SimplePeer({
        initiator: false, // Client is not the initiator
        trickle: false,
      });

      // Receive offer from surveillance device
      socket.on('webrtc-offer', (data) => {
        newPeer.signal(data);
      });

      // Send answer back to surveillance device
      newPeer.on('signal', (data) => {
        socket.emit('webrtc-answer', data);
      });

      // Handle incoming media stream
      newPeer.on('stream', (remoteStream) => {
        videoRef.current.srcObject = remoteStream;
      });

      newPeer.on('error', (err) => {
        console.error('Peer connection error:', err);
      });

      setPeer(newPeer);
    }
  }, [socket]);

  return (
    <div>
      <h1>Surveillance Feed</h1>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default Surveillance;