const knex = require('../database/knex.js');
// const bcrypt = require('bcrypt');
const crypto = require('crypto');

const USER_TABLE = 'users';



const createNewUser = async (firstName, lastName, email, password) => {
    console.log('Raw password:', password);
    //generates a random salt
  //  const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //  console.log('Password salt', salt);
    // const hashedPassword = await bcrypt.hash(password, salt);
    //hashes the password with the salt using sha256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    console.log('Hashed password', hashedPassword);

    //checks to see if the user already exists
    const isNotFirst = await knex(USER_TABLE).where({email: email}).first();
    if (isNotFirst) {
        throw new Error('User already exists');
    }
    //inserts the new user into the database
    const query = knex(USER_TABLE).insert({lastName, firstName, email, password: hashedPassword });
    const result = await query;
    return result;

};


const findUserByEmail = async (email) => {
    const query = knex(USER_TABLE).where({ email });
    const result = await query;
    return result;
}

const authenticateUser = async (email, password) => {
    const users = await findUserByEmail(email);
    console.log('Results of users query', users);
    if (users.length === 0) {
        console.error(`No users matched the email: ${email}`);
        return false;
    }
    const user = users[0];
 //   const validPassword = await bcrypt.compare(password, user.password);
    const validPassword = crypto.createHash('sha256').update(password).digest('hex') === user.password;
    if (validPassword) {
        return true;
    }
    return false;
}



module.exports = {
    createNewUser,
    findUserByEmail,
    authenticateUser
};