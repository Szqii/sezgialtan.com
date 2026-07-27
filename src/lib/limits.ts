/**
 * Limits shared by the composer, the /chat page and the API route.
 *
 * This lives in `lib/` rather than beside the component that uses it most,
 * because a Server Component has to read it too — and an `export const` inside
 * a client module is not a plain value on the server. The bundler replaces it
 * with a client-reference stub, so the constant arrives as a *function*:
 * `Number(...)` of it is NaN, and `slice(0, NaN)` returns an empty string
 * rather than throwing. That silently swallowed every typed question.
 *
 * Constants both sides need belong in a neutral module. Never import a value
 * (as opposed to a component) across the client boundary.
 */

/** Longest question a visitor may send. Enforced in three places, one number. */
export const MAX_QUESTION_CHARS = 500;

/**
 * Free questions per visitor.
 *
 * Here rather than in `rate-limit.ts`, where it used to live, because the chat
 * UI writes the number into the "that's your three" note and can't import that
 * module: it reads `CHAT_SECRET` and does HMAC work, none of which belongs in a
 * client bundle.
 */
export const MAX_QUESTIONS = 3;
