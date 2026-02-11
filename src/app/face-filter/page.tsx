'use client';

import dynamic from 'next/dynamic';

const FaceFilter = dynamic(
  () =>
    import('@/presentation/components/features/face-filter/FaceFilter').then(
      (mod) => mod.FaceFilter,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-red-900 to-red-950 text-white">
        <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
        <p className="mt-4 text-amber-200">Đang tải...</p>
      </div>
    ),
  },
);

export default function FaceFilterPage(): React.ReactElement {
  return <FaceFilter />;
}
