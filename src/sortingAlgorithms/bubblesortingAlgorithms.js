export const getBubbleSortAnimations = (array) => {
    const animations = [];
    if (array.length <= 1) return animations;
    bubbleSortHelper(array, animations);
    return animations;
};

const bubbleSortHelper = (mainArray, animations) => {
    const n = mainArray.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            animations.push(['comparison', j, j + 1]);
            if (mainArray[j] > mainArray[j + 1]) {
                animations.push(['swap', j, j + 1]);
                [mainArray[j], mainArray[j + 1]] = [mainArray[j + 1], mainArray[j]];
            }
        }
    }
};