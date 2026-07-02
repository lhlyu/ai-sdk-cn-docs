import type { ReactNode } from 'react';

type ChatMessage = {
  role?: string;
  content?: ReactNode;
  display?: ReactNode;
};

type Notification = {
  name?: string;
  message?: string;
  minutesAgo?: number;
};

type Weather = {
  temperature?: number;
  unit?: string;
  condition?: string;
  description?: string;
};

export function TextGeneration({ stream }: { stream?: boolean }) {
  return (
    <div className="doc-generation-demo">
      <div className="doc-demo-label">Prompt</div>
      <div className="doc-demo-input">Why is the sky blue?</div>
      <div className="doc-demo-label">Response</div>
      <p>
        The sky appears blue because molecules in the atmosphere scatter shorter blue wavelengths of sunlight more
        strongly than longer wavelengths.
      </p>
      {stream ? <div className="doc-demo-status">Streaming response</div> : null}
    </div>
  );
}

export function ObjectGeneration({ object, stream }: { object?: { notifications?: Notification[] }; stream?: boolean }) {
  const notifications = object?.notifications ?? [];

  return (
    <div className="doc-generation-demo">
      <div className="doc-demo-label">{stream ? 'Streaming object' : 'Generated object'}</div>
      {notifications.length > 0 ? (
        <div className="doc-notification-list">
          {notifications.map((item, index) => (
            <div className="doc-notification" key={index}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.message}</p>
              </div>
              {typeof item.minutesAgo === 'number' ? <span>{item.minutesAgo}m</span> : null}
            </div>
          ))}
        </div>
      ) : (
        <pre>{JSON.stringify(object ?? {}, null, 2)}</pre>
      )}
    </div>
  );
}

export function ChatGeneration({
  history = [],
  inputMessage,
  outputMessage,
  stream,
}: {
  history?: ChatMessage[];
  inputMessage?: ChatMessage;
  outputMessage?: ChatMessage;
  stream?: boolean;
}) {
  const messages = [...history, inputMessage, outputMessage].filter(Boolean) as ChatMessage[];

  return (
    <div className="doc-chat-demo">
      {messages.map((message, index) => (
        <div className={`doc-chat-message doc-chat-message-${roleKind(message.role)}`} key={index}>
          <div className="doc-demo-label">{message.role ?? 'Message'}</div>
          {message.content ? <div>{message.content}</div> : null}
          {message.display ? <div className="doc-chat-display">{message.display}</div> : null}
        </div>
      ))}
      {stream ? <div className="doc-demo-status">Streaming chat response</div> : null}
    </div>
  );
}

export function WeatherCard({ content, weather }: { content?: { weather?: Weather }; weather?: Weather }) {
  const value = content?.weather ?? weather ?? {};
  const temperature = typeof value.temperature === 'number' ? `${value.temperature}${value.unit ?? '°C'}` : '24°C';
  const condition = value.condition ?? value.description ?? 'Sunny';

  return (
    <div className="doc-weather-card">
      <div>
        <div className="doc-demo-label">Weather</div>
        <strong>{temperature}</strong>
      </div>
      <span>{condition}</span>
    </div>
  );
}

export function CardPlayer({ title, description, type }: { title?: string; description?: string; type?: string }) {
  return (
    <div className="doc-card-player">
      <div className="doc-card-player-preview">
        <div className="doc-card-player-chip">{type ?? 'preview'}</div>
        <div className="doc-card-player-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div>
        {title ? <div className="doc-card-player-title">{title}</div> : null}
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export function BrowserIllustration({ blocking }: { highlight?: boolean; blocking?: boolean }) {
  return (
    <div className="doc-browser-illustration">
      <div className="doc-browser-topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="doc-browser-lines">
        <span className={blocking ? 'doc-line-muted' : ''} />
        <span className={blocking ? 'doc-line-muted' : ''} />
        <span />
      </div>
      <div className="doc-demo-status">{blocking ? 'Waits for the full response' : 'Renders tokens as they arrive'}</div>
    </div>
  );
}

export function VercelIcon() {
  return <span aria-hidden="true" className="doc-vercel-icon" />;
}

function roleKind(role: string | undefined): string {
  return role?.toLowerCase().includes('user') || role === '用户' ? 'user' : 'assistant';
}
