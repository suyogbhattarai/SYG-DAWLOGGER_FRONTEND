import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: "Portfolio | Showcase of Production Excellence",
  description: "Explore our archive of production projects, featuring studio sessions, collaborative masterpieces, and bespoke audio solutions managed via Dawlogger.",
  keywords: "music production portfolio, producer showcase, studio projects, version control examples, dawlogger showcase",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
