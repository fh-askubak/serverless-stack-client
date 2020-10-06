import React, { useState } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default () => {
  const [text, setText] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const { value } = event.target;
    alert('encrypt the text: ', value);
  }
  return (
    <>
    <form onSubmit={handleSubmit}>
      <FormGroup controlId="encrypt" bsSize="large">
        <ControlLabel>Encrypt my Text!</ControlLabel>
        <FormControl
          autoFocus
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </FormGroup>
      <Button
        type="submit"
        block
        bsSize="large"
      >
        Encrypt
      </Button>
    </form>
    </>
  )
}