import { FormEvent } from 'react';

export function formAction(f: Function) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    f();
  };
}

export function normalizeDropdownChange(f: Function) {
  return (
    _: FormEvent<HTMLInputElement>,
    params: string | { value: string },
    value: number,
  ) => {
    if (typeof params === 'object' && params.value) {
      f(params.value);
    } else {
      f(value);
    }
  };
}
