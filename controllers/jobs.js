const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobsList = await Job.find({ posted_by: req.user.userID }).sort(
    "createdAt"
  );
  res
    .status(StatusCodes.OK)
    .json({ jobs: jobsList, num_of_jobs: jobsList.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req; //user comes from auth middleware and id from the route naming
  console.log(jobID);
  const job = await Job.findOne({ _id: jobID, posted_by: userID });
  if (!job) {
    throw new NotFoundError("No job with that ID");
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.posted_by = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobID, posted_by: userID });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).send("Successfully deleted");
};

const updateJob = async (req, res) => {
  const {
    body: { company, company_description, position, working_hours, salary },
    user: { userID },
    params: { id: jobID },
  } = req;
  if (
    company === "" ||
    company_description === "" ||
    position === "" ||
    !working_hours ||
    !salary
  ) {
    throw new BadRequestError("Please provide all of the required fields");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobID, posted_by: userID },
    req.body,
    { new: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob,
};
