export default function MessageBubble({
  content,
  mine,
  time,
}: { content: string; mine: boolean; time: string }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${mine ? "bg-brand text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-900 rounded-bl-sm"}`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-slate-400"}`}>
          {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
