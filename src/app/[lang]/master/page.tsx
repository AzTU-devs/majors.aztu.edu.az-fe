import type { Metadata } from "next";

import CataloguePage, { catalogueMetadata } from "@/components/catalogue/CataloguePage";
import { localeParam } from "@/lib/params";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return catalogueMetadata(localeParam((await params).lang), 2, await searchParams);
}

export default async function Page({ params, searchParams }: Props) {
  return (
    <CataloguePage locale={localeParam((await params).lang)} degree={2} searchParams={await searchParams} />
  );
}
