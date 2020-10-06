import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import './LB.css';

export default props => (
  <Button
    className={`LoaderButton ${props.className ? props.className : null}`}
    disabled={props.disabled || props.isLoading}
    {...props}>
      {props.isLoading && <Glyphicon glyph="refresh" className="spinning" />}
      {props.children}
    </Button>
)