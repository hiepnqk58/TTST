const mongoose = require("mongoose");
const moment = require("moment");
const { toJSON, paginate } = require("./plugins");

const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    full_name: { type: String, required: true },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ["Male", "Female"] },
    military_id: { type: String, unique: true },
    unit_id: { type: Schema.Types.ObjectId, ref: "unit" },
    rank: { type: String },
    position: { type: String },
    joined_date: { type: Date },
    education_level: { type: String },
    major: { type: String },
    status: { type: String },
    activity_history: [{ type: Schema.Types.ObjectId, ref: "activity" }],
    commendations: [{ type: Schema.Types.ObjectId, ref: "commendation" }],
    disciplines: [{ type: Schema.Types.ObjectId, ref: "discipline" }],
    is_deleted: { type: Boolean, default: false },
    deleted_by: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    minimize: false,
  }
);

memberSchema.pre(["find", "findOne"], function (next) {
  this.where({
    $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
  });
  next();
});

memberSchema.post(["find", "findOne", "findOneAndUpdate"], function (res) {
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

memberSchema.plugin(toJSON);
memberSchema.plugin(paginate);

const Member = mongoose.model("member", memberSchema, "member");
module.exports = Member;
