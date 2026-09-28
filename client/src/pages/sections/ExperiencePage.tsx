import Experience from '../../components/carrousel/Experience';
import { companies } from '../../components/carrousel/experienceData';
import FloatingBackButton from '../../components/FloatingBackButton';

export default function ExperiencePage() {
  return (
    <div className="experience-page">
      <FloatingBackButton to="/" label="Back to Home" />
      <Experience companies={companies} />
    </div>
  );
}
