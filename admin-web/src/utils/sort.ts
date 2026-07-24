import type { SortState } from "../models/Sort";
export function handleSortChage<TField extends string>(currentSort: SortState<TField> | undefined, field: TField): SortState<TField> {
    if (!currentSort || currentSort.field !== field) {
        return {
            field,
            direction: "asc",
        }
    }
    return {
        field,
        direction: currentSort.direction === "asc" ? "desc" : "asc",
    };
}
export function getSortIcon<TField extends string>(
    sort: SortState<TField> | undefined,
    field: TField
): string {
    if (!sort || sort.field !== field) return "⇅";
    return sort.direction === "asc" ? "↑" : "↓";
}