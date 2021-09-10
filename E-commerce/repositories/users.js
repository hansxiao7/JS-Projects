const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    create = async (attrs) => {
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);


        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);

        return record;
    }

    comparePasswords = async (saved, supplied) =>{
        const [userPassword, salt] = saved.split('.');
        const buf = await scrypt(supplied, salt, 64);

        return buf.toString('hex') === userPassword;

    }

}


// const test = async () =>{
//     const repo = new UsersRepository('user.json');
//     // await repo.create({email :'test@test.com', password:'password'});
//     await repo.delete("46031463");
// }

// test();
module.exports = new UsersRepository('users.json');