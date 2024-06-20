export const getQuickSortAnimations = (array) => {
    const animations = [];
    if (array.length <= 1) return animations;
    quickSortHelper(array, 0, array.length - 1, animations);
    return animations;
};

const quickSortHelper = (mainArray, startIdx, endIdx, animations) => {
    if (startIdx < endIdx) {
        const pivotIdx = partition(mainArray, startIdx, endIdx, animations);
        quickSortHelper(mainArray, startIdx, pivotIdx - 1, animations);
        quickSortHelper(mainArray, pivotIdx + 1, endIdx, animations);
    }
};

const partition = (mainArray, startIdx, endIdx, animations) => {
    const pivotValue = mainArray[endIdx];
    let pivotIdx = startIdx;
    for (let i = startIdx; i < endIdx; i++) {
        animations.push(['comparison', i, endIdx]);
        if (mainArray[i] < pivotValue) {
            animations.push(['swap', i, pivotIdx]);
            [mainArray[i], mainArray[pivotIdx]] = [mainArray[pivotIdx], mainArray[i]];
            pivotIdx++;
        }
    }
    animations.push(['swap', pivotIdx, endIdx]);
    [mainArray[pivotIdx], mainArray[endIdx]] = [mainArray[endIdx], mainArray[pivotIdx]];
    return pivotIdx;
};