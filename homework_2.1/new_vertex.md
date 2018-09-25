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
The function's basic operation is filling a list, using the '.push' operator. Which takes linear time as the problem states.

In terms of the input size, what is the algorithm’s worst-case asymptotic time complexity?
---------------------------------------------------
Starting with the .push inside the for loop, the complexity is n. The algorithm iterates from i = 1 to n - 1. Then there are two more basic operations outside of the loop. When you evaluate the summation you get (n-1)n/2 and then add the two operations outside of the loop. The final answer is Theta((n-1)n/2 + 2) = Theta(n^2).

In terms of the input size, what is the algorithm’s worst-case asymptotic space complexity?
---------------------------------------------------
When evaluating the algorithm's worst-case space complexity, there is 1 within the for loop that is iterated from i = 1 to n - 1. The summation evaluates to n. Then outside of the for loop we add 2 to n for the other lines of code. Which gives you a final answer of Theta(n + 2) = Theta(n).
