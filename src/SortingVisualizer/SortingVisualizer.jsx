import React, { useState, useEffect, useCallback } from 'react';
import './SortingVisualizer.css';
import { getMergeSortAnimations } from '../sortingAlgorithms/mergesortingAlgorithms';
import { getQuickSortAnimations } from '../sortingAlgorithms/quicksortingAlgorithms';
import { getHeapSortAnimations } from '../sortingAlgorithms/heapsortingAlgorithms';
import { getBubbleSortAnimations } from '../sortingAlgorithms/bubblesortingAlgorithms';

const PRIMARY_COLOR = '#61dafb';
const SECONDARY_COLOR = 'darkgrey';
const ANIMATION_SPEED_MS = 100;

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [numberOfArrayBars, setNumberOfArrayBars] = useState(10);
  const [sortingAlgorithm, setSortingAlgorithm] = useState('Merge Sort');
  const [barsVisible, setBarsVisible] = useState(true);

  const generateNewArray = useCallback(() => {
    if (isSorting) return;
    const newArray = Array.from({ length: numberOfArrayBars }, () =>
      randomIntFromInterval(5, 100)
    );
    setArray(newArray);
    setBarsVisible(true);
    console.log('New array generated:', newArray); // Log the new array
  }, [isSorting, numberOfArrayBars]);

  // Call generateNewArray only when the component mounts
  useEffect(() => {
    generateNewArray();
  }, []); // Empty dependency array means this runs only once

  const handleArraySizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    if (!isNaN(newSize) && newSize > 0) {
      setNumberOfArrayBars(newSize);
      generateNewArray();
    }
  };

  const handleSortingAlgorithmChange = (event) => {
    setSortingAlgorithm(event.target.value);
  };

  const animateComparison = (barOneIdx, barTwoIdx) => {
    return new Promise((resolve) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      if (
        barOneIdx < 0 ||
        barOneIdx >= arrayBars.length ||
        barTwoIdx < 0 ||
        barTwoIdx >= arrayBars.length
      ) {
        console.error('Invalid indices for comparison:', barOneIdx, barTwoIdx);
        resolve();
        return;
      }

      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      const color = SECONDARY_COLOR;

      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
      }, ANIMATION_SPEED_MS);

      setTimeout(() => {
        barOneStyle.backgroundColor = PRIMARY_COLOR;
        barTwoStyle.backgroundColor = PRIMARY_COLOR;
        resolve();
      }, ANIMATION_SPEED_MS * 2);
    });
  };

  const animateSwap = (barOneIdx, barTwoIdx) => {
    return new Promise((resolve) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      if (
        barOneIdx < 0 ||
        barOneIdx >= arrayBars.length ||
        barTwoIdx < 0 ||
        barTwoIdx >= arrayBars.length
      ) {
        console.error('Invalid indices for swap:', barOneIdx, barTwoIdx);
        resolve();
        return;
      }

      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;

      setTimeout(() => {
        const tempHeight = barOneStyle.height;
        barOneStyle.height = barTwoStyle.height;
        barTwoStyle.height = tempHeight;
        resolve();
      }, ANIMATION_SPEED_MS);
    });
  };

  const animateOverwrite = (barIdx, newHeight) => {
    return new Promise((resolve) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      if (barIdx < 0 || barIdx >= arrayBars.length) {
        console.error('Invalid index for overwrite:', barIdx);
        resolve();
        return;
      }

      const barStyle = arrayBars[barIdx].style;

      setTimeout(() => {
        barStyle.height = `${newHeight * 5}px`;
        resolve();
      }, ANIMATION_SPEED_MS);
    });
  };

  const getAnimationsForAlgorithm = (algorithm, array) => {
    switch (algorithm) {
      case 'Merge Sort':
        return getMergeSortAnimations(array);
      case 'Quick Sort':
        return getQuickSortAnimations(array);
      case 'Heap Sort':
        return getHeapSortAnimations(array);
      case 'Bubble Sort':
        return getBubbleSortAnimations(array);
      default:
        return [];
    }
  };

  const sort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    const arrayCopy = [...array];
    const animations = getAnimationsForAlgorithm(sortingAlgorithm, arrayCopy);

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const [type, ...args] = animation;

      if (type === 'comparison') {
        const [barOneIdx, barTwoIdx] = args;
        await animateComparison(barOneIdx, barTwoIdx);
      } else if (type === 'swap') {
        const [barOneIdx, barTwoIdx] = args;
        await animateSwap(barOneIdx, barTwoIdx);
      } else if (type === 'overwrite') {
        const [barIdx, newHeight] = args;
        await animateOverwrite(barIdx, newHeight);
      }
    }

    // Update the array state to reflect the sorted array
    arrayCopy.sort((a, b) => a - b); // Assuming the array is sorted in ascending order
    console.log('Sorted array:', arrayCopy); // Log the sorted array
    setArray(arrayCopy);
    setIsSorting(false);
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <div className="array-container">
      <div className="controls">
        <button onClick={generateNewArray} disabled={isSorting}>
          Generate New Array
        </button>
        <select
          value={sortingAlgorithm}
          onChange={handleSortingAlgorithmChange}
          disabled={isSorting}
        >
          <option value="Merge Sort">Merge Sort</option>
          <option value="Quick Sort">Quick Sort</option>
          <option value="Heap Sort">Heap Sort</option>
          <option value="Bubble Sort">Bubble Sort</option>
        </select>
        <button onClick={sort} disabled={isSorting}>
          Sort
        </button>
        <input
          type="number"
          value={numberOfArrayBars}
          onChange={handleArraySizeChange}
          min="1"
          disabled={isSorting}
        />
      </div>
      {barsVisible && (
        <div className="array-bars-container">
          {array.map((value, idx) => (
            <div key={idx} className="array-item">
              <div
                className="array-bar"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  height: `${value * 5}px`,
                }}
              ></div>
              <div className="array-value">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;
