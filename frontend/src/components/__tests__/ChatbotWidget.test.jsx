import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ChatbotWidget } from '../ChatbotWidget';

const apiUrl = 'https://chat.example.test';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

async function openChat() {
    const user = userEvent.setup();
    render(<ChatbotWidget />);
    await user.click(screen.getByRole('button', { name: 'Open chatbot' }));
    return user;
}

it('posts a question to Cloud Run and displays the response', async () => {
    vi.stubEnv('VITE_GCLOUD_RUN_URL', apiUrl);
    const fetchChat = vi.fn().mockResolvedValue(
        Response.json({ response: 'Richard studies at Waterloo.' }),
    );
    vi.stubGlobal('fetch', fetchChat);

    const user = await openChat();
    await user.type(screen.getByRole('textbox', { name: 'Chat message' }), 'Where does Richard study?{Enter}');

    expect(await screen.findByText('Richard studies at Waterloo.')).toBeVisible();
    expect(fetchChat).toHaveBeenCalledExactlyOnceWith(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Where does Richard study?' }),
    });
});

it('shows an error and allows another question after a service failure', async () => {
    vi.stubEnv('VITE_GCLOUD_RUN_URL', apiUrl);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    const user = await openChat();
    const input = screen.getByRole('textbox', { name: 'Chat message' });
    await user.type(input, 'Where?');
    await user.click(screen.getByRole('button', { name: '[EXEC]' }));

    expect(await screen.findByText('Chat is temporarily unavailable.')).toBeVisible();
    expect(input).toBeEnabled();
});

it('disables messages when the Cloud Run URL is missing', async () => {
    vi.stubEnv('VITE_GCLOUD_RUN_URL', '');
    await openChat();

    expect(screen.getByRole('textbox', { name: 'Chat message' })).toBeDisabled();
    expect(screen.getByText('Chat is temporarily unavailable.')).toBeVisible();
});
