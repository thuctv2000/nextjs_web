import { MusicPlayer } from '@/presentation/components/features/lixi/MusicPlayer';

export default function LixiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MusicPlayer />
    </>
  );
}
