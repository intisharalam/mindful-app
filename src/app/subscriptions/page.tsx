"use client";

import { useState } from "react";
import { CHANNELS, DEFAULT_SUBSCRIBED_CHANNEL_IDS, Channel } from "@/lib/channels";

export default function SubscriptionsPage() {
  const [subscribedIds, setSubscribedIds] = useState<string[]>(
    DEFAULT_SUBSCRIBED_CHANNEL_IDS
  );

  const toggleSubscribe = (id: string) => {
    setSubscribedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const subscribed = CHANNELS.filter((c) => subscribedIds.includes(c.id));
  const suggested = CHANNELS.filter((c) => !subscribedIds.includes(c.id));

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">
        Subscriptions
      </h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Follow creators whose deep content you want to see more often.
      </p>

      {subscribed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3 pb-2 border-b border-border-soft">
            Subscribed
          </h2>
          <div className="flex flex-col gap-3">
            {subscribed.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                subscribed
                onToggle={() => toggleSubscribe(channel.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3 pb-2 border-b border-border-soft">
          Suggested for you
        </h2>
        <div className="flex flex-col gap-3">
          {suggested.map((channel) => (
            <ChannelRow
              key={channel.id}
              channel={channel}
              subscribed={false}
              onToggle={() => toggleSubscribe(channel.id)}
            />
          ))}
        </div>
      </section>

      {subscribed.length === 0 && (
        <p className="text-[12px] text-ink-tertiary mt-6">
          You haven&apos;t subscribed to anyone yet — try one of the
          suggestions above.
        </p>
      )}
    </div>
  );
}

function ChannelRow({
  channel,
  subscribed,
  onToggle,
}: {
  channel: Channel;
  subscribed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border border-border-soft rounded-xl p-3.5">
      <div className="w-11 h-11 rounded-full bg-deep-bg flex items-center justify-center text-[20px] shrink-0">
        {channel.avatarEmoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-ink">{channel.name}</p>
        <p className="text-[11px] text-ink-tertiary mb-1">
          {channel.handle} · {channel.subscriberCount} subscribers
        </p>
        <p className="text-[12px] text-ink-secondary leading-snug line-clamp-2">
          {channel.description}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`shrink-0 text-[12px] font-medium rounded-full px-4 py-1.5 ${
          subscribed
            ? "border border-border text-ink-secondary hover:bg-app-bg"
            : "bg-deep text-white hover:opacity-90"
        }`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
