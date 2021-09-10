const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository{
    constructor(filename){
        if (!filename){
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        
        try {
            fs.accessSync(filename);
        } catch (err) {
            fs.writeFileSync(filename, '[]');
        }
    }

    create = async (attrs) => {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

        return attrs;
    }

    getAll = async () => {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        );
    
    }


    writeAll = async (records) => {
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2)
        );
    }
    
    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    getOne = async (id) =>{
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    delete = async (id) =>{
        const records = await this.getAll();
        const fileteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(fileteredRecords);
    }

    update = async (id, attrs) =>{
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        
        if (!record){
            throw new Error(`Record with id ${id} not found!`);
        }
        
        // copy elements from attrs to record
        Object.assign(record, attrs);

        await this.writeAll(records);
    }

    getOneBy = async (filters) => {
        const records = await this.getAll();
        for (let record of records){
            let found = true;

            for (let key in filters){
                if (filters[key] !== record[key]) {
                    found = false;
                }
            }

            if (found){
                return record;
            }
        }
    }
}