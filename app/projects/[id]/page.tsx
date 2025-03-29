import ProjectContent from './_components/ProjectContent';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectContent id={params.id} />;
} 