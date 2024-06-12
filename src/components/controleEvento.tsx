import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Participante } from '../models/Participante';

interface ControleEventoProps {
  participants: Participante[];
  onAddParticipant: () => void;
  onParticipantChange: (index: number, field: keyof Participante, value: string) => void;
  onRemoveParticipant: (index: number) => void;
}

const ControleEvento: React.FC<ControleEventoProps> = ({ participants, onAddParticipant, onParticipantChange, onRemoveParticipant }) => {
  return (
    <div>
      {participants.map((participant, index) => (
        <div key={index} className="mb-3">
          <Row>
            <Col>
              <Form.Group controlId={`participantName${index}`}>
                <Form.Label>Nome do Participante:</Form.Label>
                <Form.Control
                  type="text"
                  value={participant.name}
                  onChange={(e) => onParticipantChange(index, 'name', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`participantEmail${index}`}>
                <Form.Label>Email do Participante:</Form.Label>
                <Form.Control
                  type="email"
                  value={participant.email}
                  onChange={(e) => onParticipantChange(index, 'email', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`participantPhone${index}`}>
                <Form.Label>Telefone do Participante:</Form.Label>
                <Form.Control
                  type="tel"
                  value={participant.phone || ''}
                  onChange={(e) => onParticipantChange(index, 'phone', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs="auto" className="align-self-end">
              <Button variant="danger" onClick={() => onRemoveParticipant(index)}>Excluir</Button>
            </Col>
          </Row>
        </div>
      ))}
      <Button variant="success" onClick={onAddParticipant}>Adicionar Participante</Button>
    </div>
  );
};

export default ControleEvento;
