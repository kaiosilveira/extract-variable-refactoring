[![Continuous Integration](https://github.com/kaiosilveira/extract-variable-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/extract-variable-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my "refactoring" catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Extract variable

**Formerly: Introduce Explaining Variable**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
return (
  order.quantity * order.itemPrice -
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
  Math.min(order.quantity * order.itemPrice * 0.1, 100);
);
```

</td>

<td>

```javascript
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

</td>
</tr>
</tbody>
</table>

**Inverse of: [Inline Variable](https://github.com/kaiosilveira/inline-variable-refactoring)**

Oftentimes, expressions become hard to read and add a lot of overhead when trying to understand a given piece of code. Extracting a variable for a complex expression helps the reader by reducing the amount of logic to interpret, replacing it basically with well-structured text.

## Working examples

For this refactoring, we are going to analyze two working examples that calculate the final price of an order: a functional approach and an Object-Oriented approach.

### Working example #1: The functional approach

As our first working example, we start with a code to calculate a `price`, based on some discount rules. The initial code looks like this:

```javascript
function price(order) {
  // price is base price - quantity discount + shipping
  return (
    order.quantity * order.itemPrice -
    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
    Math.min(order.quantity * order.itemPrice * 0.1, 100)
  );
}
```

#### Test suite

The unit testing approach for this example was tricky, mainly because the `price` function is doing multiple things. Tests were added to cover the following aspects of it:

- Customers should have a 5% discount per item for every item, starting after 500 units
- Customers should be charged either 10% of the total base price of the order or 100, whatever amount is the lowest.

For implementation details, please see [function.test.js](./function.test.js).

#### Steps

To perform this refactoring we start by introducing a new variable called `basePrice`, which will not be used yet:

```diff
diff --git a/function.js b/function.js
@@ -1,5 +1,6 @@
 function price(order) {
   // price is base price - quantity discount + shipping
+  const basePrice = order.quantity * order.itemPrice;
   return (
     order.quantity * order.itemPrice -
     Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
```

Then, we replace the occurrence of its value in the two places it occurs:

```diff
diff --git a/function.js b/function.js
@@ -2,9 +2,9 @@ function price(order) {
   // price is base price - quantity discount + shipping
   const basePrice = order.quantity * order.itemPrice;
   return (
-    order.quantity * order.itemPrice -
+    basePrice -
     Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
-    Math.min(order.quantity * order.itemPrice * 0.1, 100)
+    Math.min(basePrice * 0.1, 100)
   );
 }
```

Then, we move on to the discount part:

```diff
diff --git a/function.js b/function.js
@@ -1,6 +1,7 @@
 function price(order) {
   // price is base price - quantity discount + shipping
   const basePrice = order.quantity * order.itemPrice;
+  const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
   return (
     basePrice -
     Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
```

Then, we replace the discount expression by its already calculated value:

```diff
diff --git a/function.js b/function.js
@@ -2,11 +2,7 @@ function price(order) {
   // price is base price - quantity discount + shipping
   const basePrice = order.quantity * order.itemPrice;
   const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
-  return (
-    basePrice -
-    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
-    Math.min(basePrice * 0.1, 100)
-  );
+  return basePrice - quantityDiscount + Math.min(basePrice * 0.1, 100);
 }

 module.exports = { price };
```

And the same applies to the shipping calculation. First, we introduce the shipping variable:

```diff
diff --git a/function.js b/function.js
@@ -2,7 +2,8 @@ function price(order) {
   // price is base price - quantity discount + shipping
   const basePrice = order.quantity * order.itemPrice;
   const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
-  return basePrice - quantityDiscount + Math.min(basePrice * 0.1, 100);
+  const shipping = Math.min(basePrice * 0.1, 100);
+  return basePrice - quantityDiscount + shipping;
 }

 module.exports = { price };
```

Then we can replace the shipping calculation with its variable:

```diff
diff --git a/function.js b/function.js
@@ -3,7 +3,7 @@ function price(order) {
   const basePrice = order.quantity * order.itemPrice;
   const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
   const shipping = quantityDiscount + Math.min(basePrice * 0.1, 100);
-  return basePrice - quantityDiscount + Math.min(basePrice * 0.1, 100);
+  return basePrice - quantityDiscount + shipping;
 }

 module.exports = { price };
```

And, finally, we can remove the useless comment:

```diff
diff --git a/function.js b/function.js
@@ -1,5 +1,4 @@
 function price(order) {
-  // price is base price - quantity discount + shipping
   const basePrice = order.quantity * order.itemPrice;
   const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
   const shipping = quantityDiscount + Math.min(basePrice * 0.1, 100);
```

#### Commit history

See below a chronology (from top to bottom) of all the refactoring steps:

| Commit SHA                                                                                                              | Message                                            |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [7428c73](https://github.com/kaiosilveira/extract-variable-refactoring/commit/7428c7312aceb1d18150f8e36f996f6ca9d1a074) | introduce the basePrice variable                   |
| [b36df25](https://github.com/kaiosilveira/extract-variable-refactoring/commit/b36df25e64471ad31e8d27f49abe194dbb74c6aa) | replace base price calculation by its new variable |
| [576ee4b](https://github.com/kaiosilveira/extract-variable-refactoring/commit/576ee4bd51cbdafdb5220c4c5af0112261c9fa41) | introduce quantityDiscount                         |
| [a196cf5](https://github.com/kaiosilveira/extract-variable-refactoring/commit/a196cf5af6886cef03f12063b6a9ba16a8d11de1) | replace discount expression by its variable        |
| [f08c850](https://github.com/kaiosilveira/extract-variable-refactoring/commit/f08c8501a8aaf4429c2d1768049015b6d753f5b4) | introduce the shipping variable                    |
| [446ff41](https://github.com/kaiosilveira/extract-variable-refactoring/commit/446ff41b7edcf342e2ee9c923aee88fe95c05a33) | remove now useless comment                         |

The full commit history can be seen in the [Commit History tab](https://github.com/kaiosilveira/extract-variable-refactoring/commits/main).

### Working example #2: The object-oriented approach

Our second working example is an `Order` class that has a getter to provide its `price`. The code in the `price` getter is complicated and full of math expressions without much reasoning.

```javascript
class Order {
  constructor(aRecord) {
    this._data = aRecord;
  }

  get quantity() {
    return this._data.quantity;
  }

  get itemPrice() {
    return this._data.itemPrice;
  }

  get price() {
    return (
      this.quantity * this.itemPrice -
      Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
      Math.min(this.quantity * this.itemPrice * 0.1, 100)
    );
  }
}
```

#### Test suite

Unit testing for this object-oriented approach is more straightforward, as we can simply adapt the same tests created for the functional example. On top of that, some other unit tests were added to perform some simple assertions on the getters (`quantity` and `itemPrice`), though, to make sure they're matching what's being passed as the source of truth, i.e., the `record` data.

For implementation details, see [order.test.js](./order.test.js).

#### Steps

For this example, we have an `Order` class that holds the data for a given `record` and knows how to calculate its final price. The code inside the `price` method is actually the same one used in the functional example. To refactor that, we:

- introduce `basePrice` getter in the Order class:

```diff
diff --git a/order.js b/order.js
@@ -11,6 +11,10 @@ class Order {
     return this._data.itemPrice;
   }

+  get basePrice() {
+    return this.quantity * this.itemPrice;
+  }
+
   get price() {
     return (
       this.quantity * this.itemPrice -
```

- use the encapsulated `basePrice` getter at `Order.price`:

```diff
diff --git a/order.js b/order.js
@@ -17,7 +17,7 @@ class Order {

   get price() {
     return (
-      this.quantity * this.itemPrice -
+      this.basePrice -
       Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
       Math.min(this.quantity * this.itemPrice * 0.1, 100)
     );
```

- introduce `quantityDiscount` getter:

```diff
diff --git a/order.js b/order.js
@@ -15,6 +15,10 @@ class Order {
     return this.quantity * this.itemPrice;
   }

+  get quantityDiscount() {
+    return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;
+  }
+
   get price() {
     return (
       this.basePrice -
```

- use encapsulated `quantityDiscount` getter at `Order.price`:

```diff
diff --git a/order.js b/order.js
@@ -21,9 +21,7 @@ class Order {

   get price() {
     return (
-      this.basePrice -
-      Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
-      Math.min(this.quantity * this.itemPrice * 0.1, 100)
+      this.basePrice - this.quantityDiscount + Math.min(this.quantity * this.itemPrice * 0.1, 100)
     );
   }
 }
```

- introduce `shipping` getter:

```diff
diff --git a/order.js b/order.js
@@ -19,6 +19,10 @@ class Order {
     return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;
   }

+  get shipping() {
+    return Math.min(this.quantity * this.itemPrice * 0.1, 100);
+  }
+
   get price() {
     return (
       this.basePrice - this.quantityDiscount + Math.min(this.quantity * this.itemPrice * 0.1, 100)
```

- use encapsulated `shipping` getter at `Order.price`:

```diff
diff --git a/order.js b/order.js
@@ -24,9 +24,7 @@ class Order {
   }

   get price() {
-    return (
-      this.basePrice - this.quantityDiscount + Math.min(this.quantity * this.itemPrice * 0.1, 100)
-    );
+    return this.basePrice - this.quantityDiscount + this.shipping;
   }
 }
```

And we are done!

#### Commit history

See below a chronology (from top to bottom) of all the refactoring steps:

| Commit SHA                                                                                                              | Message                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [b01ce19](https://github.com/kaiosilveira/extract-variable-refactoring/commit/b01ce191750fcd78b4d6d820b9055dd49ffaa1d4) | introduce basePrice getter in the Order class           |
| [50242dc](https://github.com/kaiosilveira/extract-variable-refactoring/commit/50242dc56685c1eac3182891068d890d711b392f) | use the encapsulated basePrice getter at Order.price    |
| [725105d](https://github.com/kaiosilveira/extract-variable-refactoring/commit/725105dfc744b80eade5726f05a9e56a6daa6a55) | introduce quantityDiscount getter                       |
| [9844be3](https://github.com/kaiosilveira/extract-variable-refactoring/commit/9844be3311a6044a477842daa03eafe6f0117876) | use encapsulated shipping getter at Order.price         |
| [02cf861](https://github.com/kaiosilveira/extract-variable-refactoring/commit/02cf861106b4ad1a94b8e3d2722106aa8093b0ff) | introduce shipping getter                               |
| [bf684fd](https://github.com/kaiosilveira/extract-variable-refactoring/commit/bf684fda08032b0ece82aadd046f12f307e2d362) | use encapsulated quantityDiscount getter at Order.price |

The full commit history can be seen in the [Commit History tab](https://github.com/kaiosilveira/extract-variable-refactoring/commits/main).
