export function normalizeGameName(name) {
    return String(name || '').trim().toLocaleLowerCase();
}
