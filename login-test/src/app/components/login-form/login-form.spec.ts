import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';
import { LoginFormComponent } from './login-form';

const expectedError = 'Username must be at least 5 characters.'
const testUsername = 'valid_user';
const testPassword = 'secure_password_123';

const usernameReg = /username/i;
const passwordReg = /password/i;
const loginBtnReg = /log in/i

describe('LoginFormComponent', () => {

  // --- TEST 1: Initial Rendering and DOM Queries ---
  it('should render the form with labeled inputs and no error', async () => {
    await render(LoginFormComponent)

    // Assert: Using Testing Library's "screen" queries
    expect(screen.getByLabelText(usernameReg)).toBeInTheDocument();
    expect(screen.getByLabelText(passwordReg)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: loginBtnReg })).toBeInTheDocument();

    // Assert initial state: Error message text should not be in the document
    expect(screen.queryByText(expectedError)).not.toBeInTheDocument();
  });

  // --- TEST 2: Validation Failure and Error Display ---
  it('should display an error message when validation fails', async () => {

    await render(LoginFormComponent);
    const user = userEvent.setup();

    // 1. Arrange: Find elements
    const usernameInput = screen.getByLabelText(usernameReg);
    const submitButton = screen.getByRole('button', { name: loginBtnReg });

    // 2. Act: Simulate user input and submit using Testing Library utilities
    await user.type(usernameInput, 'test');
    await user.click(submitButton);

    // 3. Assert: Check for the error message
    const errorMessageElement = await screen.findByText(expectedError);
    expect(errorMessageElement).toBeInTheDocument();
  });

  // --- TEST 3: Successful Submission and Event Emission ---
  it('should emit a "loginSubmit" event with credentials on successful submission', async () => {
    // 1. Arrange: Spy on the output event
    const loginSubmitSpy = vi.fn();

    await render(LoginFormComponent, {
      componentProperties: {
        loginSubmit: <any>{ emit: loginSubmitSpy },
      },
    });
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(usernameReg);
    const passwordInput = screen.getByLabelText(passwordReg);
    const submitButton = screen.getByRole('button', { name: loginBtnReg });

    // 2. Act: Simulate successful user input and submit
    await user.type(usernameInput, testUsername);
    await user.type(passwordInput, testPassword);

    await user.click(submitButton);

    // 3. Assert: Check if the event was emitted and the payload is correct
    expect(loginSubmitSpy).toHaveBeenCalledTimes(1);
    expect(loginSubmitSpy).toHaveBeenCalledWith({
      username: testUsername,
      password: testPassword,
    });
    // Assert: Check that the error message is NOT displayed
    expect(screen.queryByText(expectedError)).not.toBeInTheDocument();
  });

    // --- TEST 4: Snapshot Matching ---
  it('should be matching the snapshot', async () => {
    const { fixture } = await render(LoginFormComponent);
    expect(fixture.nativeElement).toMatchSnapshot();
  });

});
