const mongoose = require("mongoose");
const moment = require("moment");
const { toJSON, paginate } = require("./plugins");

const Schema = mongoose.Schema;

const disciplineSchema = new mongoose.Schema(
  {
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "member" },
    violation_date: { type: Date },
    content: { type: String },
    level: { type: String },
    resolution: { type: String },
    is_deleted: { type: Boolean, default: false },
    deleted_by: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    minimize: false,
  }
);

disciplineSchema.pre(["find", "findOne"], function (next) {
  this.where({
    $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
  });
  next();
});

disciplineSchema.post(["find", "findOne", "findOneAndUpdate"], function (res) {
  if (!res || !this.mongooseOptions().lean) return;
  (Array.isArray(res) ? res : [res]).forEach(transformDoc);
});

function transformDoc(doc) {
  doc.id = doc._id;
  doc.created_at = moment(doc.created_at).format("YYYY-MM-DD HH:mm:ss");
  doc.updated_at = moment(doc.updated_at).format("YYYY-MM-DD HH:mm:ss");
  delete doc._id;
  delete doc.__v;
}

disciplineSchema.plugin(toJSON);
disciplineSchema.plugin(paginate);

const Discipline = mongoose.model("discipline", disciplineSchema, "discipline");
module.exports = Discipline;
