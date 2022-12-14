import React, { FormEvent, useEffect, useMemo, useState } from 'react';

import {
  Form,
  InlineNotification,
  Modal,
  Stack,
  TextInput,
} from '@carbon/react';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { object, string } from 'yup';

import './Register.scss';

import { AppLogo, Box, FullScreenContainer } from '../../components';
import { useStore, useValidation } from '../../hooks';

enum FormState {
  Registering,
  RegisterError,
}

type Props = {
  onRegisterSuccess: (user: User) => void;
  onLoginClick: () => void;
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 16;

export default function Register({ onRegisterSuccess, onLoginClick }: Props) {
  const { registerEmail } = useStore();
  const auth = getAuth();

  const [email, setEmail] = useState(registerEmail || '');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState | undefined>(undefined);

  const isSubmitting = useMemo(
    () => formState === FormState.Registering,
    [formState],
  );

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
        password: string()
          .min(PASSWORD_MIN_LENGTH, () => ({
            field: 'password',
            key: 'min',
            message: `Please enter between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} letters`,
          }))
          .max(PASSWORD_MAX_LENGTH, () => ({
            field: 'password',
            key: 'max',
            message: `Please enter between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} letters`,
          })),
      }),
    [email],
  );

  const { clearError, setSchema, validate, validationProps } =
    useValidation(registerSchema);

  useEffect(() => {
    setSchema(registerSchema);
  }, [registerSchema]);

  async function handleRegister() {
    const isValid = await validate({ email, confirmEmail, password });

    if (!isValid) {
      return;
    }

    setFormState(FormState.Registering);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      onRegisterSuccess(userCredential.user);
    } catch (error) {
      setFormState(FormState.RegisterError);
    }
  }

  function handleLoginClick() {
    onLoginClick();
  }

  function clearFormState() {
    setFormState(undefined);
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.RegisterError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem creating your account."
            hideCloseButton
            lowContrast={false}
          />
        );
      default:
        return null;
    }
  }

  return (
    <FullScreenContainer center className="fullScreenBackground">
      <div className="RegisterContainer">
        <Modal
          open
          primaryButtonText="Create account"
          secondaryButtonText="Back to sign in"
          preventCloseOnClickOutside
          primaryButtonDisabled={isSubmitting}
          onRequestSubmit={handleRegister}
          onRequestClose={handleLoginClick}
          onSecondarySubmit={handleLoginClick}>
          <Stack gap={6}>
            <header>
              <Stack gap={6}>
                <Box hAlign="center" padding={16}>
                  <AppLogo />
                </Box>
                <Stack gap={3}>
                  <h2>Create an account</h2>
                  <p>
                    Already have an account?{' '}
                    <a onClick={handleLoginClick}>Sign in with your account</a>
                  </p>
                </Stack>
              </Stack>
            </header>
            <main>
              <Form>
                <Stack gap={6}>
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
                  <TextInput
                    required
                    id="confirmEmail"
                    type="text"
                    labelText="Confirm email address"
                    value={confirmEmail}
                    disabled={isSubmitting}
                    {...validationProps('confirmEmail')}
                    onChange={(event: FormEvent<HTMLInputElement>) => {
                      setConfirmEmail(event.currentTarget.value);
                      clearError('confirmEmail');
                      clearFormState();
                    }}
                  />
                  <TextInput
                    required
                    id="password"
                    type="password"
                    labelText="Password"
                    value={password}
                    helperText={`Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} letters`}
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
