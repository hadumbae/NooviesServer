export default function filterNullArray(data: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null && value !== undefined),
    );
}