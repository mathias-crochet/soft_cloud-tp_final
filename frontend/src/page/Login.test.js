import { act } from 'react';
import { render, fireEvent, waitFor, } from '@testing-library/react';
import { Login } from './Login';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders Login and checks form submission', async () => {
    await act(async () => {
        const { getByLabelText, getByRole } = render(
            <Login />
        );

        const submitButton = getByRole('button', { name: /Se connecter/i });
        const emailInput = getByLabelText('Email Address');
        const passwordInput = getByLabelText('Password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });
    });
});
