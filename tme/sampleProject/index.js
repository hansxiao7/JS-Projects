module.exports = {
    forEach(arr, fn){
        for (let ele of arr){
            fn(ele);
        }
    }
}