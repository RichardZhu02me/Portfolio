import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from '../HeroSection';

describe('HeroSection Components Quick Wins', () => {
    it('Should contain the terminal prompt', () => {
        render(<HeroSection />);
        const prompt = screen.getByText(/root@architect:~#/i);
        expect(prompt).toBeInTheDocument();
    });
});
