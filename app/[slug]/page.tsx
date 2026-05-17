import { redirect } from "next/navigation";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/api/t/${slug}`);
}
