# Server.ts Manual Edit Required

Due to line ending issues, please manually add this code to `src/server.ts`:

## Location:
Find this section (around line 72):
```typescript
// Search API (Unified)
import searchRouter from './routes/search';
app.use('/api/protected/search', searchRouter);

// Import/Ingestion API
import importRouter from './routes/import';
```

## Add These Lines:
```typescript
// Search API (Unified)
import searchRouter from './routes/search';
app.use('/api/protected/search', searchRouter);

// Mercado Libre OAuth
import mercadolibreRouter from './routes/mercadolibre';
app.use('/api/auth/mercadolibre', mercadolibreRouter);

// Import/Ingestion API
import importRouter from './routes/import';
```

The new 3 lines to add are:
```typescript
// Mercado Libre OAuth
import mercadolibreRouter from './routes/mercadolibre';
app.use('/api/auth/mercadolibre', mercadolibreRouter);
```

Save the file and the server will auto-restart (if using `tsx watch`).
