"use strict";

const AWS = require("aws-sdk");

module.exports = {
  run: function (options, cb) {
    const ecs = new AWS.ECS();
    const params = {
      cluster: options.clusterArn,
      taskDefinition: options.taskDefinitionArn,
      launchType: options.launchType,
      overrides: {
        containerOverrides: [
          {
            name: options.containerName,
            command: options.cmd,
          },
        ],
      },
    };

    if (options.startedBy !== undefined) {
      params.startedBy = options.startedBy;
    }

    if (options.env !== undefined) {
      params.overrides.containerOverrides[0].environment = options.env;
    }

    if (
      options.subnets !== undefined ||
      options.securityGroups !== undefined ||
      options.assignPublicIp !== undefined
    ) {
      params.networkConfiguration = { awsvpcConfiguration: {} };
    }

    if (options.assignPublicIp !== undefined) {
      params.networkConfiguration.awsvpcConfiguration.assignPublicIp =
        options.assignPublicIp ? "ENABLED" : "DISABLED";
    }

    if (options.subnets !== undefined) {
      params.networkConfiguration.awsvpcConfiguration.subnets = options.subnets;
    }

    if (options.securityGroups !== undefined) {
      params.networkConfiguration.awsvpcConfiguration.securityGroups =
        options.securityGroups;
    }

    ecs.runTask(params, cb);
  },

  stop: function (options, cb) {
    const ecs = new AWS.ECS();
    const params = {
      cluster: options.clusterArn,
      task: options.taskId,
      reason: options.reason,
    };

    ecs.stopTask(params, cb);
  },
};
