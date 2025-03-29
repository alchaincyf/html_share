import PreviewContent from './_components/PreviewContent';

export default function PreviewPage({ params }: { params: { id: string } }) {
  return <PreviewContent id={params.id} />;
} 