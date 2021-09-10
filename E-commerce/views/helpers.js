module.exports = {
    getError(errors, prop){
        try{
            //Returns: an object where the keys are the field names, and the values are the validation errors
            return errors.mapped()[prop].msg;
        } catch (err){
            return '';
        }
    }
}