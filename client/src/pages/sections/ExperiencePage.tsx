import Experience from '../../components/carrousel/Experience';
import { companies } from '../../components/carrousel/experienceData';
import FloatingBackButton from '../../components/FloatingBackButton';
import SeoHead from '../../seo/SeoHead';

export default function ExperiencePage() {
  return (
    <>
      <SeoHead page="experience" />
    <div className="experience-page">
      <FloatingBackButton to="/" label="Back to Home" />
      <Experience companies={companies} />
    </div>
    </>
  );
}
