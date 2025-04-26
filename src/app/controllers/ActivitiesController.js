const config = require("../../configs/app");
const activityModel = require("../models/Activity");
const { successResponse, errorResponse } = require("../../helper/responseJson");
const bcrypt = require("bcryptjs/dist/bcrypt");
var ObjectID = require("mongodb").ObjectID;
var mongoose = require("mongoose");

module.exports.getAllPaginate = async (req, res) => {
  let limit = req.query.take || 12;
  let index = req.query.skip || 0;
  let totalCount = req.query.requireTotalCount
    ? (await activityModel.find({})).length
    : 0;
  let activites = await activityModel
    .find({})
    .sort({ created_at: -1 })
    .skip(index)
    .limit(limit)
    .lean();
  return successResponse(res, { activites, totalCount }, 200, "Success");
};

/**
 * Lấy danh sách tất cả người dùng
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getAll = async (req, res) => {
  let activities = await activityModel.find({});
  return successResponse(res, activities, 200, "Success");
};

/**
 * Xem thông tin chi tiết một người dùng.
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getDetail = async (req, res) => {
  let activityID = req.query.id;
  if (activityID) {
    let data = await activityModel.findById(activityID);
    return successResponse(res, data, 200, "Success");
  }
  return errorResponse(res, 409, "activityID not found.");
};

/**
 * Thêm mới người dùng.
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.add = async (req, res) => {
  try {
    let newActivity = {
      ...req.body,
    };
    let activity = await activityModel.create(newActivity);
    return successResponse(res, member, 200, "Activity add Success");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Activity add error");
  }
};

/**
 * Cập nhật thông tin người dùng.
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.edit = async (req, res) => {
  let activityID = req.body.id;
  try {
    let activity = await activityModel.findById(activityID).lean();
    // let conditionRole = JSON.parse(req.body.conditions_role);
    if (activity) {
      let editActivity = {
        full_name: req.body.full_name,
        date_of_birth: req.body.date,
        gender: req.body.gender,
        military_id: req.body.military_id,
        unit_id: req.body.unit_id,
        rank: req.body.rank,
        position: req.body.position,
        joined_date: req.body.joined_date,
        education_level: req.body.education_level,
        major: req.body.major,
        status: req.body.status,
        activity_history: req.body.activity_history,
        commendations: req.body.commendations,
        disciplines: req.body.disciplines,
      };

      const activityUpdate = await activityModel.findOneAndUpdate(
        { _id: activityID },
        editActivity,
        { new: true }
      );
      return successResponse(res, activityUpdate, 200, "Activity edit success");
    }
    return errorResponse(res, 404, "Activity not found.");
  } catch (error) {
    return errorResponse(res, 500, "Activity edit error.");
  }
};

/**
 * Xoá người dùng
 * @param {*} req
 * @param {*} res
 * @returns
 */

module.exports.delete = async (req, res) => {
  try {
    let id = req.body.id;
    let activity = await activityModel.findById(id);
    if (activity) {
      await activityModel.findByIdAndUpdate(
        id,
        { is_deleted: true },
        { new: true, upsert: true }
      );
      return successResponse(res, "", 200, "Activity delete success");
    }
    return errorResponse(res, 404, "Activity not found.");
  } catch (error) {
    return errorResponse(res, 500, "Activity delete error");
  }
};

module.exports.search = async (req, res) => {
  try {
    let queryValueSearch = [];
    let limit = req.query.take || 12;
    let index = req.query.skip || 0;
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    let filter = req.query.filter;
    let conditions = [
      { created_at: { $lte: new Date(endDate) } },
      { created_at: { $gte: new Date(startDate) } },
    ];
    if (filter) {
      queryValueSearch = [
        {
          name: {
            $regex: ".*" + filter + ".*",
            $options: "i",
          },
        },
      ];
    }
    conditions =
      queryValueSearch.length > 0
        ? {
            $and: [
              {
                $or: queryValueSearch,
              },
              {
                $and: conditions,
              },
            ],
          }
        : {
            $and: [
              {
                $and: conditions,
              },
            ],
          };
    let totalCount = req.query.requireTotalCount
      ? await activityModel.find(conditions).count()
      : 0;

    let data = await activityModel
      .find(conditions)
      .sort({ created_at: -1 })
      .skip(index)
      .limit(limit)
      .lean();
    return successResponse(res, { member: data, totalCount }, 200, "Success");
  } catch (error) {
    return errorResponse(res, 500, "Activity search error");
  }
};
