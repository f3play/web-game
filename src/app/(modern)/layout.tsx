import ModernLayout from '@/layouts/modern/layout';
export const metadata = {
  title: 'F3Play',
  description: 'F3Play',
};
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModernLayout>{children}</ModernLayout>;
}
