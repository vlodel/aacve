const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define(
    'cve',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3Vector: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3attackVector: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3attackComplexity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3privilegesRequired: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3userInteraction: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3scope: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3confidentialityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3integrityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3availabilityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3baseScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v3baseSeverity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v3exploitabilityScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v3impactScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v2Vector: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2accessVector: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2accessComplexity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2authentication: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2confidentialityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2integrityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2availabilityImpact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2baseScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v2severity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      v2exploitabilityScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v2impactScore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      v2acInsufInfo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      v2obtainAllPrivilege: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      v2obtainUserPrivilege: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      v2obtainOtherPrivilege: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      v2userInteractionRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastModifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
