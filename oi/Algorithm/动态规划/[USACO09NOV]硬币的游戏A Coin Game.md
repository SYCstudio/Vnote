# [USACO09NOV]硬币的游戏A Coin Game
[BZOJ2017 Luogu2964]

农夫约翰的奶牛喜欢玩硬币游戏.  
初始时，一个有N枚硬币的堆栈放在地上，从堆顶数起的第i枚硬币的币值 为Ci  
开始玩游戏时，第一个玩家可以从堆顶拿走一枚或两枚硬币.如果第一个玩家只拿走堆顶的 一枚硬币，那么第二个玩家可以拿走随后的一枚或两枚硬币.如果第一个玩家拿走两枚硬币，则第二个玩家可以拿走1，2，3，或4枚硬币.在每一轮中，当前的玩家至少拿走一枚硬币，至多拿 走对手上一次所拿硬币数量的两倍.当没有硬币可拿时，游戏结束.  
两个玩家都希望拿到最多钱数的硬币.请问，当游戏结束时，第一个玩家最多能拿多少钱 呢？

设 $F[i][j]$ 表示剩下 $i$ 个硬币，上一轮玩家取了 $j$ 个，那么也就意味着这一轮可以选的硬币数量是 $[1..2j]$ 。直接转移是 $O(n)$ 的，可以发现对于同一个 $i$ ，$j+1$ 只比 $j$ 的多最多两个转移，把这两个转移单独拿出来求一下最小值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=2020;
const int maxM=20;
const int inf=2147483647;

int n;
int C[maxN];
int F[maxN][maxN];

int main(){
	freopen("in","r",stdin);
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&C[i]),C[i]+=C[i-1];

	for (int i=1;i<=n;i++){
		int mn=inf;
		for (int j=1;j<=n;j++){
			int p=min(j*2-1,i);
			mn=min(mn,F[i-p][p]);
			p=min(j*2,i);
			mn=min(mn,F[i-p][p]);
			F[i][j]=C[n]-C[n-i]-mn;
		}
	}

	printf("%d\n",F[n][1]);
	return 0;
}
```