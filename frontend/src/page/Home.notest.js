import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';




// Mocking fetch
global.fetch = jest.fn();

describe('Home component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders loading message while fetching user data', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        await act(async () => {
            render(
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            );
        });

        expect(screen.getByText('Loading user data...')).toBeInTheDocument();

        await act(async () => {
            // Wait for data to be fetched
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Ensure loading message disappears
        expect(screen.queryByText('Loading user data...')).not.toBeInTheDocument();
    });

    test('displays user data when fetched successfully', async () => {
        const userData = { name: 'John', firstname: 'Doe', age: 30 };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => userData,
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await act(async () => {
            // Wait for data to be fetched
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(screen.getByText(`Nom : ${userData.name}`)).toBeInTheDocument();
        expect(screen.getByText(`Prénom : ${userData.firstname}`)).toBeInTheDocument();
        expect(screen.getByText(`Age : ${userData.age} ans`)).toBeInTheDocument();
    });

    test('logs out when logout button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await act(async () => {
            // Wait for data to be fetched
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        userEvent.click(screen.getByLabelText('logout'));

        // Ensure fetch is called with logout endpoint
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
    });

    // Add more tests for login status check if needed
});
