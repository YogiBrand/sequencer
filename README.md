# @fishmouth/sequence-builder

Modern, production-ready **Sequence Builder UI** for FishMouth – a GoHighLevel-inspired workflow designer built with React, TypeScript, and React Flow.

Build powerful, automated sequences for lead nurturing, conversions, and engagement with an intuitive visual interface.

## Features

- ✨ **Visual Flow Editor** – Drag-and-drop interface powered by React Flow
- 🎯 **11 Node Types** – Email, SMS, Voice Call, Wait, Condition, SmartScan, Task, Lead Replacement, Report, Start, End
- 📋 **Template System** – Quick-start with pre-built sequence templates
- ✅ **Real-time Validation** – Ensures flow integrity before saving
- 🔌 **Complete API Integration** – Works seamlessly with FishMouth backend
- 🎭 **Mock Backend** – MSW-powered mocking for standalone development
- 📘 **TypeScript First** – Fully typed for excellent DX
- 🚀 **Production Ready** – Battle-tested components and patterns

## Quick Start

```bash
# Install dependencies
npm install

# Start development server with mock backend
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Open [http://localhost:5173](http://localhost:5173) to see the demo application.

## Usage as a Library

### Installation

```bash
npm install @fishmouth/sequence-builder
```

### Basic Usage

```tsx
import {
  SequenceManager,
  createSequenceClient,
} from '@fishmouth/sequence-builder';

// Create API client
const client = createSequenceClient({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: {
    Authorization: `Bearer ${yourAuthToken}`,
  },
});

// Use in your app
function SequencesPage() {
  return (
    <SequenceManager
      client={client}
      onSequenceSelected={(sequence) => {
        console.log('Selected:', sequence);
      }}
      onSequenceSaved={(sequence) => {
        console.log('Saved:', sequence);
      }}
    />
  );
}
```

### Embedded Builder

```tsx
import { SequenceBuilder, createSequenceClient } from '@fishmouth/sequence-builder';

const client = createSequenceClient({ baseURL: 'http://localhost:8000' });

function CustomBuilderPage() {
  const [sequence, setSequence] = useState(null);

  const handleSave = async (sequenceData) => {
    if (sequenceData.id) {
      const updated = await client.sequences.update(sequenceData.id, sequenceData);
      setSequence(updated);
    } else {
      const created = await client.sequences.create(sequenceData);
      setSequence(created);
    }
  };

  return (
    <SequenceBuilder
      initialSequence={sequence}
      onSave={handleSave}
      onClose={() => navigate('/sequences')}
    />
  );
}
```

## Components

### SequenceManager

The main component for listing and managing sequences.

```typescript
interface SequenceManagerProps {
  client: SequenceClient;              // Required: API client instance
  onSequenceSelected?: (seq) => void;  // Called when sequence is clicked
  onSequenceSaved?: (seq) => void;     // Called after save/create
  onEnterBuilder?: (seq?) => void;     // Called when entering builder mode
}
```

### SequenceBuilder

Visual workflow editor for creating and editing sequences.

```typescript
interface SequenceBuilderProps {
  sequenceId?: number;                     // ID if editing existing
  initialSequence?: Sequence | null;       // Initial data
  onSave?: (seq: Partial<Sequence>) => void | Promise<void>;
  onClose?: () => void | Promise<void>;
  readonly?: boolean;                      // View-only mode
}
```

## API Client

### Creating a Client

```typescript
import { createSequenceClient } from '@fishmouth/sequence-builder';

const client = createSequenceClient({
  baseURL: 'https://api.fishmouth.com',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

### Available Methods

```typescript
// Sequences
const sequences = await client.sequences.list();
const sequence = await client.sequences.get(sequenceId);
const created = await client.sequences.create({ name: 'New Sequence', ... });
const updated = await client.sequences.update(sequenceId, { is_active: true });
await client.sequences.delete(sequenceId);

// Templates
const templates = await client.sequences.getTemplates();

// Enrollments
const result = await client.sequences.enrollLeads(sequenceId, {
  lead_ids: [1, 2, 3],
});

// Analytics
const performance = await client.sequences.getPerformance(sequenceId);
const analytics = await client.sequences.getAnalytics(sequenceId);
```

## Backend Integration

### Required Endpoints

Your backend must implement these REST API endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/sequences` | List all sequences |
| `GET` | `/api/sequences/:id` | Get single sequence |
| `POST` | `/api/sequences` | Create new sequence |
| `PUT` | `/api/sequences/:id` | Update sequence |
| `DELETE` | `/api/sequences/:id` | Delete sequence |
| `GET` | `/api/sequences/templates` | Get templates |
| `POST` | `/api/sequences/:id/enroll` | Enroll leads |
| `PUT` | `/api/sequences/enrollments/:id` | Update enrollment |
| `POST` | `/api/sequences/process` | Trigger processing |
| `GET` | `/api/sequences/:id/performance` | Get performance metrics |
| `GET` | `/api/sequences/:id/analytics` | Get detailed analytics |

### Data Contracts

**Sequence Object:**

```typescript
interface Sequence {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  flow_data: FlowData | null;
  total_enrolled?: number;
  total_completed?: number;
  total_converted?: number;
  conversion_rate?: number;
  created_at: string;
  updated_at?: string | null;
}
```

**Flow Data Structure:**

```typescript
interface FlowData {
  nodes: Array<{
    id: string;
    type: SequenceNodeType;
    position: { x: number; y: number };
    data: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    data?: { condition?: 'true' | 'false' };
  }>;
}
```

**Supported Node Types:**

- `start` – Sequence entry point
- `end` – Sequence exit point
- `email` – Send email
- `sms` – Send SMS
- `voice_call` – AI-powered voice call
- `wait` – Delay execution
- `condition` – Branch based on condition
- `smartscan` – AI property scan
- `task` – Assign task to team
- `lead_replacement` – Replace lead if needed
- `report` – Generate and send report

See [src/types/sequence.ts](./src/types/sequence.ts) for complete type definitions.

## Project Structure

```
sequencer/
├── src/
│   ├── api/
│   │   └── sequenceClient.ts       # HTTP client
│   ├── components/
│   │   ├── SequenceBuilder/        # Visual builder
│   │   ├── SequenceManager/        # List & orchestration
│   │   ├── NodeConfigurator/       # Node config panel
│   │   └── common/                 # Shared components
│   ├── hooks/                      # React hooks
│   ├── mocks/                      # MSW handlers & mock data
│   ├── types/                      # TypeScript definitions
│   ├── utils/                      # Validation & helpers
│   ├── index.ts                    # Public API
│   ├── App.tsx                     # Demo application
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
└── package.json
```

## Development

The demo app uses Mock Service Worker (MSW) to simulate the backend API, so you can develop and test without a real server.

### Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm test` – Run tests
- `npm run lint` – Run linter

## Architecture

### Component Hierarchy

```
App
└── SequenceManager
    ├── SequenceCard (multiple)
    ├── TemplateSelector (modal)
    └── SequenceBuilder (on edit)
        ├── NodePalette
        ├── ReactFlow Canvas
        │   └── SequenceNode (custom nodes)
        └── NodeConfigurator
```

### Key Technologies

- **React 18** – UI framework
- **TypeScript** – Type safety
- **Vite** – Build tool
- **React Flow** – Visual flow editor
- **Tailwind CSS** – Styling
- **Axios** – HTTP client
- **MSW** – API mocking
- **Vitest** – Testing

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

Proprietary – © 2025 FishMouth

---

**Built with ❤️ for FishMouth**
