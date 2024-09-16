'use strict';
const {
  Model, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'order_item' });
    }
  }

  Order.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    // Virtual field for the total
    total: {
      type: Sequelize.VIRTUAL,
      get() {
        // Accessing associated order items to calculate the total
        const orderItems = this.getDataValue('order_item') || [];
        return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      set(value) {
        throw new Error('Do not try to set the `total` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
  });

  return Order;
};
