import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillsSection } from '../SkillsSection';

describe('SkillsSection Components Quick Wins', () => {
    it('Should highlight modern AI stack skills and remove generic web dev skills', () => {
        render(<SkillsSection />);

        // High Signal Skills
        expect(screen.getByText(/LangGraph/i)).toBeInTheDocument();
        expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
        expect(screen.getByText(/ChromaDB/i)).toBeInTheDocument();
        expect(screen.getByText(/Transformers/i)).toBeInTheDocument();

        // Generic Skills should be removed
        expect(screen.queryByText(/HTML\/CSS/i)).not.toBeInTheDocument();
    });
});
