// Define a type for the direction with strict typing
enum DIRECTION {
  up = -1,
  down = 1,
}

// Check if the element has a scrollable overflow type
function isOverflowScrollable(element: Element): boolean {
  const overflowY = getComputedStyle(element).overflowY;
  return (
    (element === document.scrollingElement && overflowY === 'visible') ||
    overflowY === 'scroll' ||
    overflowY === 'auto'
  );
}

// Determine if an element is scrollable in a given direction
function isScrollable(element: Element, direction: DIRECTION): boolean {
  if (!isOverflowScrollable(element)) {
    return false;
  }

  switch (direction) {
    case DIRECTION.down:
      return element.scrollTop + element.clientHeight < element.scrollHeight;
    case DIRECTION.up:
      return element.scrollTop > 0;
    default:
      throw new Error('Unsupported direction');
  }
}

/**
 * Check if any ancestor of the element is scrollable in the given direction.
 * This will be used in ``PullRefresh`` to differentiate between a scroll action and a refresh action.
 */
function isTreeScrollable(element: Element | null, dir: DIRECTION): boolean {
  if (
    element === null ||
    (element === document.body &&
      getComputedStyle(document.body).overflowY === 'hidden')
  ) {
    return false;
  }

  return (
    isScrollable(element, dir) || isTreeScrollable(element.parentElement, dir)
  );
}

// Exporting the necessary functions and constants
export { DIRECTION, isTreeScrollable };
