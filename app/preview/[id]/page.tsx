import RawHtmlContent from './_components/RawHtmlContent';

export const dynamic = 'force-dynamic';

export default function PreviewPage({ params }: { params: { id: string } }) {
  return <RawHtmlContent id={params.id} />;
} 