/*二分查找*/

function branchSearch(val,arr,startIndex,endIndex){
    if(!val || !(arr instanceof Array)) return;

    var len = arr.length,
        startIndex = typeof startIndex === 'number'?startIndex:0,
        endIndex = typeof endIndex === 'number'? endIndex:len-1,
        midIndex = Math.floor((endIndex - startIndex) / 2),
        midVal = arr[midIndex];
    if (startIndex > endIndex) return;
    if ( midVal === val) {
        return midIndex;
    } else if(midVal > val){
        return branchSearch(val,arr,startIndex,midIndex-1);
    } else {
        return branchSearch(val,arr,midIndex+1,endIndex);
    }
}