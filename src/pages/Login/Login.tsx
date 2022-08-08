import React, { FormEvent, useMemo, useState } from 'react';

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
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { object, string } from 'yup';

import './Login.scss';

import { FullScreenContainer } from '../../components';
import { useValidation } from '../../hooks';

enum FormState {
  LoggingIn,
  LoginError,
  SendingResetPassword,
  ResetPasswordError,
  ResetPasswordSent,
}

type Props = {
  onLoggedIn: (user: User) => void;
  onRegisterClick: (email: string) => void;
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

export default function Login({ onLoggedIn, onRegisterClick }: Props) {
  const auth = getAuth();

  const { clearError, validate, validationProps } = useValidation(loginSchema);

  const [email, setEmail] = useState(
    window.localStorage.getItem('email') || '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(
    Boolean(window.localStorage.getItem('rememberEmail')),
  );
  const [formState, setFormState] = useState<FormState | null>(null);

  const isSubmitting = useMemo(
    () =>
      formState === FormState.LoggingIn ||
      formState === FormState.SendingResetPassword,
    [formState],
  );

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

    setFormState(FormState.LoggingIn);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      onLoggedIn(userCredential.user);
    } catch (error) {
      setFormState(FormState.LoginError);
    }
  }

  function handleRegister() {
    onRegisterClick(email);
  }

  async function handleResetPassword() {
    try {
      setFormState(FormState.SendingResetPassword);
      await sendPasswordResetEmail(auth, email);
      setFormState(FormState.ResetPasswordSent);
    } catch (error) {
      setFormState(FormState.ResetPasswordError);
    }
  }

  function clearFormState() {
    setFormState(null);
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.LoginError:
        return (
          <InlineNotification
            kind="error"
            subtitle={
              <span>
                The email address or password that you've entered doesn't match
                any account.{' '}
                <Link onClick={handleResetPassword}>
                  <strong>Reset password</strong>
                </Link>
              </span>
            }
            hideCloseButton
            lowContrast={false}
          />
        );

      case FormState.SendingResetPassword:
        return (
          <InlineNotification
            kind="info"
            subtitle={<span>Sending reset password email...</span>}
            hideCloseButton
            lowContrast={false}
          />
        );

      case FormState.ResetPasswordError:
        return (
          <InlineNotification
            kind="error"
            subtitle={
              <span>
                The email address that you've entered doesn't match any account.{' '}
                <Link onClick={handleRegister}>
                  <strong>Create an account</strong>
                </Link>
              </span>
            }
            hideCloseButton
            lowContrast={false}
          />
        );

      case FormState.ResetPasswordSent:
        return (
          <InlineNotification
            kind="success"
            subtitle={
              <span>
                A reset password email has been sent to <b>{email}</b>. Please
                follow the instructions in the email to reset your password.
              </span>
            }
            hideCloseButton
            lowContrast={false}
          />
        );

      default:
        return null;
    }
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
                    disabled={isSubmitting}
                    {...validationProps('email')}
                    onChange={(event: FormEvent<HTMLInputElement>) => {
                      setEmail(event.currentTarget.value);
                      clearError('email');
                      clearFormState();
                    }}
                  />
                  <Checkbox
                    id="rememberEmail"
                    labelText="Remember email"
                    checked={rememberEmail}
                    disabled={isSubmitting}
                    onChange={(event: FormEvent<HTMLInputElement>) => {
                      setRememberEmail(event.currentTarget.checked);
                      clearFormState();
                    }}
                  />
                </Stack>
                <TextInput
                  required
                  id="password"
                  type="password"
                  labelText="Password"
                  value={password}
                  disabled={isSubmitting}
                  {...validationProps('password')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    setPassword(event.currentTarget.value);
                    clearError('password');
                    clearFormState();
                  }}
                />
                {renderNotifications()}
                {isSubmitting ? (
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
