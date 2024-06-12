import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import EventList from './components/EventList';
import { Evento } from './models/Evento';

const App: React.FC = () => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Evento | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log('fetchEvents')
    const response = await axios.get<Evento[]>('http://localhost:4000/event');
    console.log("res", response.data)
    setEvents(response.data);
  };

  const addNewEvent = () => {
    const newEvent: Evento = {
      id: events.length + 1,
      name: '',
      date: '',
      description: '',
      location: '',
      participants: [{ name: '', email: '', phone: '' }]
    };
    setEvents([...events, newEvent]);
    setCurrentEvent(newEvent);
  };

  return (
    <Container>
      <h1>Gestão de Eventos</h1>
      <Button variant="success" onClick={addNewEvent}>Novo Evento</Button>
      <EventList events={events} setEvents={setEvents} currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
    </Container>
  );
};

export default App;
