import { render, screen, queryByText } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AboutSection } from '../AboutSection';

describe('AboutSection Components Quick Wins', () => {
    it('Should not contain "Fullstack" or "Full-Stack Development" to maintain high-signal AI identity', () => {
        render(<AboutSection />);
        const fullstackText = screen.queryByText(/Fullstack/i);
        const fullStackDevText = screen.queryByText(/Full-Stack Development/i);

        expect(fullstackText).not.toBeInTheDocument();
        expect(fullStackDevText).not.toBeInTheDocument();
    });
});
