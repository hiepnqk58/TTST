const mongoose = require("mongoose");
const moment = require("moment");
const { toJSON, paginate } = require("./plugins");

const unitSchema = new mongoose.Schema(
  {
    unit_name: { type: String, required: true },
    unit_type: { type: String }, // e.g. Company, Battalion, Brigade
    parent_unit_id: { type: mongoose.Schema.Types.ObjectId, ref: "unit" },
    is_deleted: { type: Boolean, default: false },
    deleted_by: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    minimize: false,
  }
);

unitSchema.pre(["find", "findOne"], function (next) {
  this.where({
    $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
  });
  next();
});

unitSchema.post(["find", "findOne", "findOneAndUpdate"], function (res) {
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

unitSchema.plugin(toJSON);
unitSchema.plugin(paginate);

const Unit = mongoose.model("unit", unitSchema, "unit");
module.exports = Unit;
