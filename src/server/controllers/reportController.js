/**
 * Creates a generic report controller for a given report service.
 * Reduces duplication across daily/weekly/monthly/yearly report routes.
 *
 * @param {object} service - Report service instance
 * @returns {object} Controller methods
 */
function createReportController(service) {
  return {
    async create(req, res) {
      const report = await service.create(req.user.id, req.body);
      res.status(201).json(report);
    },

    async listByUser(req, res) {
      const reports = await service.listByUser(req.user.id);
      res.status(200).json(reports);
    },

    async listAll(req, res) {
      const reports = await service.listAll(req.query);
      res.status(200).json(reports);
    },

    async getById(req, res) {
      const report = await service.getById(req.params.id, req.user);
      res.status(200).json(report);
    },

    async update(req, res) {
      const report = await service.update(req.params.id, req.user, req.body);
      res.status(200).json(report);
    },

    async remove(req, res) {
      await service.remove(req.params.id, req.user);
      res.status(204).send();
    },
  };
}

module.exports = { createReportController };
