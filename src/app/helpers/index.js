export const formatPrice = price => {
    let nums = price.toFixed(2).toString().split('.');
    let int = nums[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return int + ',' + nums[1];
}
