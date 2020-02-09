module.exports = function (sequelize, DataTypes) {
    console.log("Create Users Table")
    var Feedback = sequelize.define("Feedback", {
        // The username to login to the site
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // The password cannot be null
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        feedback: {
            type: DataTypes.STRING,
            allowNull: false
        },

        url: {
            type: DataTypes.STRING
        }
    });

    return Feedback;
};
