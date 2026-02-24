import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
    title: "Services | Dawlogger",
    description: "Explore our suite of audio tools: Cloud Versioning, AI Stem Separation, Project Analytics, and Collaboration features.",
    keywords: "daw version control, stem separation, audio collaboration, vst plugin management",
};

export default function ServicesPage() {
    return <ServicesClient />;
}
