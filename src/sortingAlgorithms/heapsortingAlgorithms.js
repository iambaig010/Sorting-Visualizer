export const getHeapSortAnimations = (array) => {
    const animations = [];
    if (array.length <= 1) return animations;
    heapSortHelper(array, animations);
    return animations;
};

const heapSortHelper = (mainArray, animations) => {
    const n = mainArray.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(mainArray, n, i, animations);
    }

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        animations.push(['swap', 0, i]);
        [mainArray[0], mainArray[i]] = [mainArray[i], mainArray[0]];

        // Call max heapify on the reduced heap
        heapify(mainArray, i, 0, animations);
    }
};

const heapify = (mainArray, n, i, animations) => {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // left = 2*i + 1
    const right = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (left < n) {
        animations.push(['comparison', left, largest]);
        if (mainArray[left] > mainArray[largest]) {
            largest = left;
        }
    }

    // If right child is larger than largest so far
    if (right < n) {
        animations.push(['comparison', right, largest]);
        if (mainArray[right] > mainArray[largest]) {
            largest = right;
        }
    }

    // If largest is not root
    if (largest !== i) {
        animations.push(['swap', i, largest]);
        [mainArray[i], mainArray[largest]] = [mainArray[largest], mainArray[i]];

        // Recursively heapify the affected sub-tree
        heapify(mainArray, n, largest, animations);
    }
};