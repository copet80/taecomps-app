import React, { FormEvent, useMemo, useState } from 'react';

import {
  Button,
  ButtonSkeleton,
  Checkbox,
  Modal,
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
  onLoginSuccess: (user: User) => void;
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

export default function Login({ onLoginSuccess, onRegisterClick }: Props) {
  const auth = getAuth();

  const { clearError, validate, validationProps } = useValidation(loginSchema);

  const [email, setEmail] = useState(
    window.localStorage.getItem('email') || '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(
    Boolean(window.localStorage.getItem('rememberEmail')),
  );
  const [formState, setFormState] = useState<FormState | undefined>(undefined);

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
      onLoginSuccess(userCredential.user);
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
    setFormState(undefined);
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
          />
        );

      case FormState.SendingResetPassword:
        return (
          <InlineNotification
            kind="info"
            subtitle={<span>Sending reset password email...</span>}
            hideCloseButton
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
          />
        );

      default:
        return null;
    }
  }

  return (
    <FullScreenContainer center className="fullScreenBackground">
      <div className="LoginContainer">
        <Modal
          open
          primaryButtonText="Sign in"
          preventCloseOnClickOutside
          primaryButtonDisabled={isSubmitting}
          onRequestSubmit={handleLogin}>
          <Stack gap={6}>
            <header>
              <Stack gap={3}>
                <h2>Sign in to Taecomps</h2>
                <p>
                  Don't have an account?{' '}
                  <a onClick={handleRegister}>Create an account</a>
                </p>
              </Stack>
            </header>
            <main>
              <Form>
                <Stack gap={6}>
                  <Stack gap={3}>
                    <TextInput
                      data-modal-primary-focus
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
                </Stack>
              </Form>
            </main>
          </Stack>
        </Modal>
      </div>
    </FullScreenContainer>
  );
}
