const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = new Sequelize('sqlite:./database.sqlite', {
    logging: false
})

// Custom function to hash password attribute on User model
const hashPassword = (user, options) => {
    return bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash
    })
    .catch(error => {
        throw new Error(error)
    })
}

const db = {}

db.User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

db.Quizobj = sequelize.define('quizobj', {
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

db.User.hasMany(db.Quizobj)
db.Quizobj.belongsTo(db.User)
                                                    
db.User.beforeCreate(hashPassword)
db.User.beforeUpdate(hashPassword)

db.sequelize = sequelize

module.exports = db
