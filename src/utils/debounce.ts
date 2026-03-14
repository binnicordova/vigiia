/**
 * Debounce a function to be called after a certain amount of time.
 * @param func The function to debounce.
 * @param wait The time to wait in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
