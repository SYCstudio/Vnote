# [CQOI2013]新Nim游戏
[BZOJ3106 Luogu4301]

传统的Nim游戏是这样的：有一些火柴堆，每堆都有若干根火柴（不同堆的火柴数量可以不同）。两个游戏者轮流操作，每次可以选一个火柴堆拿走若干根火柴。可以只拿一根，也可以拿走整堆火柴，但不能同时从超过一堆火柴中拿。拿走最后一根火柴的游戏者胜利。  
本题的游戏稍微有些不同：在第一个回合中，第一个游戏者可以直接拿走若干个整堆的火柴。可以一堆都不拿，但不可以全部拿走。第二回合也一样，第二个游戏者也有这样一次机会。从第三个回合（又轮到第一个游戏者）开始，规则和Nim游戏一样。  
如果你先拿，怎样才能保证获胜？如果可以获胜的话，还要让第一回合拿的火柴总数尽量小。

只要先手取的使得剩下的异或和怎么都不能为 0 即可，那么用线性基维护无关线性组，从大往小贪心选取。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=111;
const int maxBit=32;
const int inf=2147483647;

ll Seq[maxN];
int Base[maxBit];

bool Insert(int key);

int main(){
	int n;scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%lld",&Seq[i]);
	sort(&Seq[1],&Seq[n+1]);
	ll sum=0;
	for (int i=n;i>=1;i--)
		if (Insert(Seq[i])==0) sum+=Seq[i];
	printf("%lld\n",sum);
	return 0;
}

bool Insert(int key){
	for (int i=maxBit-1;i>=0;i--)
		if (key&(1<<i)){
			if (Base[i]==0){
				Base[i]=key;return 1;
			}
			key^=Base[i];
		}
	return 0;
}
```