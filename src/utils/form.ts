import { FormEvent } from 'react';

export function formAction(f: Function) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    f();
  };
}
