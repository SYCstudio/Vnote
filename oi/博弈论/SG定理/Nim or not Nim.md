# Nim or not Nim
[HDU3032]

Nim is a two-player mathematic game of strategy in which players take turns removing objects from distinct heaps. On each turn, a player must remove at least one object, and may remove any number of objects provided they all come from the same heap.  
Nim is usually played as a misere game, in which the player to take the last object loses. Nim can also be played as a normal play game, which means that the person who makes the last move (i.e., who takes the last object) wins. This is called normal play because most games follow this convention, even though Nim usually does not.  
Alice and Bob is tired of playing Nim under the standard rule, so they make a difference by also allowing the player to separate one of the heaps into two smaller ones. That is, each turn the player may either remove any number of objects from a heap or separate a heap into two smaller ones, and the one who takes the last object wins. 

在原来 $nim$ 游戏的基础上增加了一种把某一堆石子拆成大于等于 $1$ 的两堆。即 $Multi-SG$ 游戏。

对于 $Multi-SG$ 游戏，有如下结论
$SG[i]= \begin{cases} i-1 \quad (i \mod 4 =0) \\\\ i \quad (i \mod 4=1,2)  \\\\ i+1 (i \mod 4 =3) \end{cases}$

那么直接 $SG$ 定理合并。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

int main(){
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		int n;scanf("%d",&n);
		int sum=0;
		for (int i=1;i<=n;i++){
			int key;scanf("%d",&key);
			if (key%4==0) key--;
			else if (key%4==3) key++;
			sum^=key;
		}
		if (sum==0) printf("Bob\n");
		else printf("Alice\n");
	}

	return 0;
}
```