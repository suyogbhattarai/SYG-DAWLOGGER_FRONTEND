import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About | Dawlogger',
    description: "Learn about Dawlogger's mission to unify creative workflows for music producers. Intelligent version control, secure backups, and collaboration tools built for the modern studio.",
    keywords: "about us, construction company history, nepal metalworks, engineering expertise nepal",
};

export default function AboutPage() {
    return <AboutClient />;
}
