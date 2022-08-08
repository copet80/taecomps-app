import React, { FormEvent, useEffect, useMemo, useState } from 'react';

import {
  Button,
  ButtonSkeleton,
  Form,
  InlineNotification,
  Stack,
  TextInput,
} from '@carbon/react';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { object, string } from 'yup';

import './Register.scss';

import { FullScreenContainer } from '../../components';
import { useStore, useValidation } from '../../hooks';

type Props = {
  onRegistered: (user: User) => void;
  onLoginClick: () => void;
};

export default function Register({ onRegistered, onLoginClick }: Props) {
  const { registerEmail } = useStore();
  const auth = getAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState(registerEmail || '');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState(false);

  const registerSchema = useMemo(
    () =>
      object({
        email: string()
          .required(() => ({
            field: 'email',
            key: 'required',
            message: 'Please enter your email address',
          }))
          .email(() => ({
            field: 'email',
            key: 'email',
            message: 'Please enter a valid email address',
          })),
        confirmEmail: string()
          .required(() => ({
            field: 'confirmEmail',
            key: 'required',
            message: 'Please re-enter your email address',
          }))
          .email(() => ({
            field: 'confirmEmail',
            key: 'email',
            message: 'Please enter a valid email address',
          }))
          .oneOf([email], () => ({
            field: 'confirmEmail',
            key: 'oneOf',
            message:
              'The email address you entered and the confirmation do not match',
          })),
        password: string().required(() => ({
          field: 'password',
          key: 'required',
          message: 'Please enter your password',
        })),
      }),
    [email],
  );

  const { clearError, errors, setSchema, validate, validationProps } =
    useValidation(registerSchema);

  useEffect(() => {
    setSchema(registerSchema);
  }, [registerSchema]);

  async function handleRegister() {
    const isValid = await validate({ email, confirmEmail, password });

    if (!isValid) {
      return;
    }

    setIsRegistering(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        onRegistered(user);
      })
      .catch((error) => {
        setIsRegistering(false);
        setRegisterError(true);
      });
  }

  function handleLogin() {
    onLoginClick();
  }

  function clearRegisterError() {
    setRegisterError(false);
  }

  return (
    <FullScreenContainer center>
      <div className="RegisterContainer">
        <Stack gap={6}>
          <header>
            <h2>Create a Taecomps account</h2>
          </header>
          <main>
            <Form>
              <Stack gap={6}>
                <TextInput
                  required
                  id="email"
                  type="text"
                  labelText="Email address"
                  value={email}
                  disabled={isRegistering}
                  {...validationProps('email')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    setEmail(event.currentTarget.value);
                    clearError('email');
                    clearRegisterError();
                  }}
                />
                <TextInput
                  required
                  id="confirmEmail"
                  type="text"
                  labelText="Confirm email address"
                  value={confirmEmail}
                  disabled={isRegistering}
                  {...validationProps('confirmEmail')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    setConfirmEmail(event.currentTarget.value);
                    clearError('confirmEmail');
                    clearRegisterError();
                  }}
                />
                <TextInput
                  required
                  id="password"
                  type="password"
                  labelText="Password"
                  value={password}
                  disabled={isRegistering}
                  {...validationProps('password')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    setPassword(event.currentTarget.value);
                    clearError('password');
                    clearRegisterError();
                  }}
                />
                {registerError && (
                  <InlineNotification
                    kind="error"
                    subtitle={
                      <span>
                        There is a problem creating your account. Please contact{' '}
                        <a href="mailto:taecomps@gmail.com">
                          taecomps@gmail.com
                        </a>
                      </span>
                    }
                    hideCloseButton
                    lowContrast={false}
                  />
                )}
                {isRegistering ? (
                  <ButtonSkeleton />
                ) : (
                  <Button onClick={handleRegister}>Create account</Button>
                )}
                <div>
                  Already have an account? <a onClick={handleLogin}>Sign in!</a>
                </div>
              </Stack>
            </Form>
          </main>
        </Stack>
      </div>
    </FullScreenContainer>
  );
}
