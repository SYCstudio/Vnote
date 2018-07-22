# Palindrome Partition
[CF932G]

Given a string s, find the number of ways to split s to substrings such that if there are k substrings (p1, p2, p3, ..., pk) in partition, then pi = pk - i + 1 for all i (1 ≤ i ≤ k) and k is even.

给定一个字符串，求将其划分为$s1,s2.....sk$，满足$k$为整数并且$s1=sk,s2=sk-1......$的方案数。

直接划分不好处理，考虑把字符串转化为$c1,cn,c2,cn-1,c3,cn-2.....$的形式，这样原来要求的划分的方案数就变成了求把当前新字符串划分成若干偶回文串的方案数。设$F[i]$为前$i$个字符的方案数，那么在回文自动机上跳$i$的回文后缀$j$，有$F[i]=\sum\_{j}F[i-S[j].len]$。回文树的$fail$树高最坏情况是$O(n)$的，这样的复杂度是$O(n^2)$。  
考虑优化。回文后缀有着很好的性质，那就是如果按照长度分类，可以分成不超过$log n$个等差数列。于是考虑每一次加上一段等差数列。对于回文树上的节点$p$，设$g[p]$表示其