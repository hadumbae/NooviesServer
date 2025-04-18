export default function filterNullArray<T extends Record<string, any>>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null && value !== undefined),
    ) as Partial<T>;
}