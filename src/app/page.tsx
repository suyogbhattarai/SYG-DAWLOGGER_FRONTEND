import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: "Dawlogger | Version Control for Music Producers",
    description: "The ultimate project management platform for music producers. Unified workflow, secure documentation, and project analysis.",
    keywords: "music production, daw version control, music collaboration, dawlogger, project management for producers",
};

export default function HomePage() {
    return (
        <>
            <HomeClient />
        </>
    );
}
