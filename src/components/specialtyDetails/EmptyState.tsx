"use client";

import InboxIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
        <InboxIcon className="text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
