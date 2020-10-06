import { useState } from 'react';

export const useFormFields = init => {
  const [fields, setValues] = useState(init);

  return [
    fields,
    (event) => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
}