const commentService = require('../services/commentService');

/**
 * POST /api/comments
 */
async function create(req, res) {
  const { role } = req.user;
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    return res.status(403).json({ message: 'Only Admins and Managers can add comments.' });
  }

  const comment = await commentService.createComment(req.user.id, req.body);
  res.status(201).json(comment);
}

/**
 * GET /api/comments/:reportType/:reportId
 */
async function list(req, res) {
  const { reportType, reportId } = req.params;
  const comments = await commentService.getCommentsForReport(reportType, reportId);
  res.status(200).json(comments);
}

module.exports = {
  create,
  list,
};
