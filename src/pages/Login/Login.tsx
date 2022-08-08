import React, { FormEvent, useState } from 'react';

import {
  Button,
  ButtonSkeleton,
  Checkbox,
  Form,
  InlineNotification,
  Link,
  Stack,
  TextInput,
} from '@carbon/react';
import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { object, string } from 'yup';

import './Login.scss';

import { FullScreenContainer } from '../../components';
import { useValidation } from '../../hooks';

type Props = {
  onLoggedIn: (user: User) => void;
  onRegisterClick: (email: string) => void;
  onRecoverPasswordClick: (email: string) => void;
};

const loginSchema = object({
  email: string().required(() => ({
    field: 'email',
    key: 'required',
    message: 'Please enter your email address',
  })),
  password: string().required(() => ({
    field: 'password',
    key: 'required',
    message: 'Please enter your password',
  })),
});

export default function Login({
  onLoggedIn,
  onRegisterClick,
  onRecoverPasswordClick,
}: Props) {
  const auth = getAuth();
  const { clearError, errors, validate, validationProps } =
    useValidation(loginSchema);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState(
    window.localStorage.getItem('email') || '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(
    Boolean(window.localStorage.getItem('rememberEmail')),
  );
  const [loginError, setLoginError] = useState(false);

  async function handleLogin() {
    const isValid = await validate({ email, password });

    if (!isValid) {
      return;
    }

    if (rememberEmail) {
      window.localStorage.setItem('email', email);
      window.localStorage.setItem('rememberEmail', 'true');
    } else {
      window.localStorage.removeItem('email');
      window.localStorage.removeItem('rememberEmail');
    }

    setIsLoggingIn(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        onLoggedIn(user);
      })
      .catch((error) => {
        setIsLoggingIn(false);
        setLoginError(true);
      });
  }

  function handleRegister() {
    onRegisterClick(email);
  }

  function handleRecoverPassword() {
    onRecoverPasswordClick(email);
  }

  function clearLoginError() {
    setLoginError(false);
  }

  return (
    <FullScreenContainer center>
      <div className="LoginContainer">
        <Stack gap={6}>
          <header>
            <h2>Sign in to Taecomps</h2>
            <h5>Organised Taekwondo Competitions</h5>
          </header>
          <main>
            <Form>
              <Stack gap={6}>
                <Stack gap={3}>
                  <TextInput
                    required
                    id="email"
                    type="text"
                    labelText="Email address"
                    value={email}
                    disabled={isLoggingIn}
                    {...validationProps('email')}
                    onChange={(event: FormEvent<HTMLInputElement>) => {
                      setEmail(event.currentTarget.value);
                      clearError('email');
                      clearLoginError();
                    }}
                  />
                  <Checkbox
                    id="rememberEmail"
                    labelText="Remember email"
                    checked={rememberEmail}
                    disabled={isLoggingIn}
                    onChange={(event: FormEvent<HTMLInputElement>) => {
                      setRememberEmail(event.currentTarget.checked);
                      clearLoginError();
                    }}
                  />
                </Stack>
                <TextInput
                  required
                  id="password"
                  type="password"
                  labelText="Password"
                  value={password}
                  disabled={isLoggingIn}
                  {...validationProps('password')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    setPassword(event.currentTarget.value);
                    clearError('password');
                    clearLoginError();
                  }}
                />
                {loginError && (
                  <InlineNotification
                    kind="error"
                    subtitle={
                      <span>
                        The email address or password that you've entered
                        doesn't match any account.{' '}
                        <Link onClick={handleRecoverPassword}>
                          <strong>Recover password</strong>
                        </Link>
                      </span>
                    }
                    hideCloseButton
                    lowContrast={false}
                  />
                )}
                {isLoggingIn ? (
                  <ButtonSkeleton />
                ) : (
                  <Button onClick={handleLogin}>Sign in</Button>
                )}
                <div>
                  Haven't got an account yet?{' '}
                  <a onClick={handleRegister}>Sign up now!</a>
                </div>
              </Stack>
            </Form>
          </main>
        </Stack>
      </div>
    </FullScreenContainer>
  );
}
