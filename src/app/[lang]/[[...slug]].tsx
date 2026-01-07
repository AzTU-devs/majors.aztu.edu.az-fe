import { redirect } from 'next/navigation';

interface Params {
  lang?: string;
  slug?: string[];
}

export default function LangRedirect({ params }: { params: Params }) {
  const { lang } = params;
  if (lang !== 'en' && lang !== 'az') {
    redirect('/az');
  }
  return null;
}