In which JavaScript file does the function appear?
--------------------------------------------------
This function appears in undirected_graph.js.

What is the name of the function?
---------------------------------
The name of the function is addVertex(vertex).

What is the size of the function’s input? (You may define more than one size variable if necessary.)
-----------------------------------------
The size of the function's input is one vertex, y. We can also define variables for m = |this.vertices|, x = |this.edges|, n = |adjacencyMatrix|.

What are the function’s basic operations?
-----------------------------------------
The function's basic operation is filling a list, using the '.push' operator.

In terms of the input size, what is the algorithm’s worst-case asymptotic time complexity?
---------------------------------------------------
Starting with the .push inside the for loop, the complexity is 1. The algorithm iterates from i = 1 to n - 1. Then there are two more basic operations outside of the loop. When you evaluate the summation you get n and then add the two operations outside of the loop. The final answer is Theta(n + 2) = Theta(n).

In terms of the input size, what is the algorithm’s worst-case asymptotic space complexity?
---------------------------------------------------
When evaluating the algorithm's worst-case space complexity, there is 2 within the for loop that is iterated from i = 1 to n - 1. The summation evaluates to 2n. Then outside of the for loop we add 3 to 2n for the three other lines of code. Which gives you a final answer of Theta(2n + 3) = Theta(n).
