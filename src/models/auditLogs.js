import mongoose from "mongoose";

const historySchema = mongoose.Schema({
    date: Date,
    query: String,
    operation: String
})
const auditLogsSchema = mongoose.Schema({
    table: String,
    history: [historySchema]
}
)

export const AuditLogs = mongoose.model("AuditLogs", auditLogsSchema)