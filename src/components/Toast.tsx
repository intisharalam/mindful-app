"use client";

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-ink text-white text-[13px] font-medium px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
        <span>🌱</span> {message}
      </div>
    </div>
  );
}
