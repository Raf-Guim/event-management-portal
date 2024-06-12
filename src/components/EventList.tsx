import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Evento } from "../models/Evento";
import { Participante } from "../models/Participante";
import ControleTexto from "./controleTexto";
import ProgressBar from "./ProgressBar";

interface EventListProps {
  events: Evento[];
  setEvents: (events: Evento[]) => void;
  currentEvent: Evento | null;
  setCurrentEvent: (event: Evento | null) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  setEvents,
  currentEvent,
  setCurrentEvent,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextId, setNextId] = useState<number>(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventChange = (field: keyof Evento, value: string) => {
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, [field]: value });
    }
  };

  const handleParticipantChange = (
    index: number,
    field: keyof Participante,
    value: string
  ) => {
    if (currentEvent) {
      const newParticipants = [...currentEvent.participants];
      newParticipants[index] = { ...newParticipants[index], [field]: value };
      setCurrentEvent({ ...currentEvent, participants: newParticipants });
    }
  };

  const addParticipant = () => {
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        participants: [
          ...currentEvent.participants,
          { name: "", email: "", phone: "" },
        ],
      });
    }
  };

  const removeParticipant = (index: number) => {
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        participants: currentEvent.participants.filter((_, i) => i !== index),
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEvent) {
      for (const participant of currentEvent.participants) {
        if (!validateEmail(participant.email)) {
          setErrorMessage(`Email do participante ${participant.name} inválido`);
          return;
        }
      }
      setErrorMessage(null);

      try {
        let event = await axios.get(`http://localhost:4000/event/${currentEvent.id}`);
        if (event.data !== "") {
          const eventToUpdate = {
            name: currentEvent.name,
            date: currentEvent.date,
            description: currentEvent.description,
            location: currentEvent.location,
            participants: currentEvent.participants.map((participant) => ({
              ...participant,
              eventId: currentEvent.id,
            })),
          };
          await axios.put(`http://localhost:4000/event/${currentEvent.id}`, eventToUpdate);
        } else {
          const eventToCreate = {
            id: nextId,
            name: currentEvent.name,
            date: currentEvent.date,
            description: currentEvent.description,
            location: currentEvent.location,
            participants: currentEvent.participants.map((participant) => ({
              name: participant.name,
              email: participant.email,
              phone: participant.phone,
            })),
          };
          const response = await axios.post("http://localhost:4000/event", eventToCreate);
          const savedEvent = response.data;
          setCurrentEvent({ ...currentEvent, id: savedEvent.id });
        }
        fetchEvents();
        setCurrentEvent(null);
      } catch (error) {
        setErrorMessage("Erro ao salvar o evento. Por favor, tente novamente.");
        console.error(error);
      }
    }
  };

  const fetchEvents = async () => {
    const response = await axios.get<Evento[]>("http://localhost:4000/event");
    setEvents(response.data);

    const maxId = response.data.reduce((max, event) => {
      const eventId = event.id ?? 0; 
      return eventId > max ? eventId : max;
    }, 0);
    setNextId(maxId + 1);
  };

  const editEvent = (event: Evento) => {
    setCurrentEvent(event);
  };

  const removeEvent = async (eventId: number) => {
    await axios.delete(`http://localhost:4000/event/${eventId}`); 
    fetchEvents(); 
    setCurrentEvent(null);
  };

  const calculateProgress = (event: Evento) => {
    let filledFields = 0;
    const totalFields = 4 + (event.participants ? event.participants.length * 3 : 0); 

    if (event.name) filledFields++;
    if (event.date) filledFields++;
    if (event.description) filledFields++;
    if (event.location) filledFields++;

    if (event.participants) {
      event.participants.forEach((participant) => {
        if (participant.name) filledFields++;
        if (participant.email) filledFields++;
        if (participant.phone) filledFields++;
      });
    }

    return (filledFields / totalFields) * 100;
  };

  return (
    <div>
      <Button 
        variant="success" 
        onClick={() => setCurrentEvent({ id: nextId, name: "", date: "", description: "", location: "", participants: [] })}
        disabled={currentEvent !== null}
      >
        Novo Evento
      </Button>
      {events.map((event) => (
        <Card key={event.id} className="mb-3">
          <Card.Body>
            <Card.Title>{event.name}</Card.Title>
            <Button variant="primary" onClick={() => editEvent(event)}>
              Editar
            </Button>
            {event.id !== undefined && (
              <Button variant="danger" onClick={() => removeEvent(event.id!)}>
                Remover Evento
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
      {currentEvent && (
        <Form onSubmit={handleSubmit}>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <ProgressBar now={calculateProgress(currentEvent)} />
          <ControleTexto
            id="eventName"
            label="Nome do Evento"
            valor={currentEvent.name}
            onChange={(value) => handleEventChange("name", value)}
          />
          <ControleTexto
            id="eventDate"
            label="Data do Evento"
            tipo="date"
            valor={currentEvent.date}
            onChange={(value) => handleEventChange("date", value)}
          />
          <ControleTexto
            id="eventDescription"
            label="Descrição"
            valor={currentEvent.description}
            textarea={true}
            onChange={(value) => handleEventChange("description", value)}
          />
          <ControleTexto
            id="eventLocation"
            label="Localização"
            valor={currentEvent.location}
            onChange={(value) => handleEventChange("location", value)}
          />
          {currentEvent.participants.map((participant, index) => (
            <div key={index} className="mb-3">
              <Row>
                <Col>
                  <ControleTexto
                    id={`participantName${index}`}
                    label="Nome do Participante"
                    valor={participant.name}
                    onChange={(value) =>
                      handleParticipantChange(index, "name", value)
                    }
                  />
                </Col>
                <Col>
                  <ControleTexto
                    id={`participantEmail${index}`}
                    label="Email do Participante"
                    valor={participant.email}
                    onChange={(value) =>
                      handleParticipantChange(index, "email", value)
                    }
                  />
                </Col>
                <Col>
                  <ControleTexto
                    id={`participantPhone${index}`}
                    label="Telefone do Participante"
                    valor={participant.phone || ""}
                    onChange={(value) =>
                      handleParticipantChange(index, "phone", value)}
                  />
                </Col>
                <Col xs="auto" className="align-self-end">
                  <Button
                    variant="danger"
                    onClick={() => removeParticipant(index)}
                  >
                    Excluir
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="success" onClick={addParticipant}>
            Adicionar Participante
          </Button>
          <Button variant="primary" type="submit">
            Salvar Evento
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EventList;
