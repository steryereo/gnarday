import { vi, type Mock } from "vitest";

/**
 * Minimal chainable stand-in for the Drizzle `db` client.
 *
 * Every builder method (`from`, `where`, `values`, ...) returns the same chain,
 * and awaiting the chain resolves to `dbMock.state.result` (or rejects with
 * `dbMock.state.error`). Tests assert on the spies, e.g. that `db.insert` was
 * never called for an unauthorized caller, or what `chain.values` received.
 */
const CHAIN_METHODS = [
  "from",
  "where",
  "orderBy",
  "innerJoin",
  "values",
  "set",
  "returning",
] as const;

type Chain = Record<(typeof CHAIN_METHODS)[number], Mock> & PromiseLike<unknown>;

function createDbMock() {
  const state: { result: unknown; error: unknown } = {
    result: [],
    error: undefined,
  };

  const chain = {} as Chain;
  for (const method of CHAIN_METHODS) {
    chain[method] = vi.fn(() => chain);
  }
  chain.then = (onFulfilled, onRejected) =>
    (state.error !== undefined
      ? Promise.reject(state.error)
      : Promise.resolve(state.result)
    ).then(onFulfilled, onRejected);

  const db = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
  };

  function reset() {
    state.result = [];
    state.error = undefined;
    for (const fn of [...Object.values(db), ...CHAIN_METHODS.map((m) => chain[m])]) {
      fn.mockClear();
    }
  }

  function wasCalled() {
    return Object.values(db).some((fn) => fn.mock.calls.length > 0);
  }

  return { db, chain, state, reset, wasCalled };
}

export const dbMock = createDbMock();
