import React from "react";
import { Form } from "react-bootstrap";

interface ControleTextoProps {
  id: string;
  label: string;
  valor?: string;
  tipo?: string;
  textarea?: boolean;
  onChange?: (novoValor: string) => void;
}

function ControleTexto(props: ControleTextoProps) {

  function valueChange(e: any) {
    if (props.onChange)
      props.onChange(e.target.value);
  }

  return (
    <Form.Group className="mb-3" controlId={props.id}>
      <Form.Label>{props.label}</Form.Label>
      {
        props.textarea ?
          <Form.Control as="textarea" rows={3} value={props.valor || ""} onChange={valueChange} />
          :
          <Form.Control type={props.tipo || "text"} value={props.valor || ""} onChange={valueChange} />
      }
    </Form.Group>
  );
}

export default ControleTexto;
