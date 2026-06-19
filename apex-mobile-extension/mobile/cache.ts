// LocalDB Cache Setup (WatermelonDB / SQLite)
// Initialises the local relational database used for offline-first storage
// of file snapshots, diff queues, and pending sync operations.

export async function initDatabase() {
  // TODO: open or create the WatermelonDB / SQLite database
}

export async function queueSync(operation: unknown) {
  // TODO: insert a pending sync operation record into the local DB
  void operation;
}

export async function dequeuePendingOps(): Promise<unknown[]> {
  // TODO: fetch all unsynced operations and return them for replay
  return [];
}
