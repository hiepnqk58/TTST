const mongoose = require("mongoose");
const moment = require("moment");
const { toJSON, paginate } = require("./plugins");

const Schema = mongoose.Schema;

const commendationSchema = new mongoose.Schema(
  {
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "member" },
    commend_date: { type: Date },
    reason: { type: String },
    form: { type: String },
    is_deleted: { type: Boolean, default: false },
    deleted_by: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    minimize: false,
  }
);

commendationSchema.pre(["find", "findOne"], function (next) {
  this.where({
    $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
  });
  next();
});

commendationSchema.post(
  ["find", "findOne", "findOneAndUpdate"],
  function (res) {
    if (!res || !this.mongooseOptions().lean) return;
    (Array.isArray(res) ? res : [res]).forEach(transformDoc);
  }
);

function transformDoc(doc) {
  doc.id = doc._id;
  doc.created_at = moment(doc.created_at).format("YYYY-MM-DD HH:mm:ss");
  doc.updated_at = moment(doc.updated_at).format("YYYY-MM-DD HH:mm:ss");
  delete doc._id;
  delete doc.__v;
}

commendationSchema.plugin(toJSON);
commendationSchema.plugin(paginate);

const Commendation = mongoose.model(
  "commendation",
  commendationSchema,
  "commendation"
);
module.exports = Commendation;
