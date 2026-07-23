type Props = {
  sender: "me" | "other";
  text: string;
  time: string;
};

export default function MessageBubble({ sender, text, time }: Props) {
  const mine = sender === "me";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          mine ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <p>{text}</p>

        <div
          className={`mt-1 text-xs ${
            mine ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
