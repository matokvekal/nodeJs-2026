// Example: Code that passes ESLint
function calculateTotal(items) {
    return 0;
  }

  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return total;
}

// Example: Code that fails ESLint
// var x = 1; // ERROR: no-var (use let or const)
// const unused = 5; // ERROR: no-unused-vars