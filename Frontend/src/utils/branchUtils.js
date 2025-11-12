export function getBranchFromRoll(roll) {
if (!roll) return "UNK";
const m = String(roll).match(/([A-Z]{3})(?=\d{5}$)/);
if (m) return m[1];
const any = String(roll).match(/[A-Z]{3}/g);
return any?.[any.length - 1] || "UNK";
}