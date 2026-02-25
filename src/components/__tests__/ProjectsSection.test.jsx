import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsSection } from '../ProjectsSection';

describe('ProjectsSection Components Quick Wins', () => {
    it('Should contain high-signal AI projects instead of tutorial projects', () => {
        render(
            <BrowserRouter>
                <ProjectsSection />
            </BrowserRouter>
        );

        // High Signal Projects
        expect(screen.getByText(/Exam Generation Engine/i)).toBeInTheDocument();
        expect(screen.getByText(/Lumen Parser/i)).toBeInTheDocument();

        // Tutorial/Outdated Projects should be removed
        expect(screen.queryByText(/Real-Time Object Detection/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/RAG Assistant/i)).not.toBeInTheDocument();
    });

    it('Should have "Read Case Study" links for the projects', () => {
        render(
            <BrowserRouter>
                <ProjectsSection />
            </BrowserRouter>
        );
        // At least two top projects should have a case study link
        const caseStudyLinks = screen.getAllByRole('link', { name: /VIEW_TRACE/i });
        expect(caseStudyLinks.length).toBeGreaterThanOrEqual(2);
    });
});
