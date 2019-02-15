# [HEOI2013]Eden 的新背包问题
[BZOJ3163 Luogu4095]

“ 寄 没 有 地 址 的 信 ，这 样 的 情 绪 有 种 距 离 ，你 放 着 谁 的 歌 曲 ，是 怎 样 的 心 情 。 能 不 能 说 给 我 听 。”  
失忆的 Eden 总想努力地回忆起过去，然而总是只能清晰地记得那种思念的 感觉，却不能回忆起她的音容笑貌。  
记忆中，她总是喜欢给 Eden 出谜题：在 valentine’s day 的夜晚，两人在闹市 中闲逛时，望着礼品店里精巧玲珑的各式玩偶，她突发奇想，问了 Eden 这样的 一个问题：有 n 个玩偶，每个玩偶有对应的价值、价钱，每个玩偶都可以被买有 限次，在携带的价钱 m 固定的情况下，如何选择买哪些玩偶以及每个玩偶买多 少个，才能使得选择的玩偶总价钱不超过 m，且价值和最大。  
众所周知的，这是一个很经典的多重背包问题，Eden 很快解决了，不过她似 乎因为自己的问题被飞快解决感到了一丝不高兴，于是她希望把问题加难：多次 询问，每次询问都将给出新的总价钱，并且会去掉某个玩偶（即这个玩偶不能被 选择），再问此时的多重背包的答案（即前一段所叙述的问题）。  
这下 Eden 犯难了，不过 Eden 不希望自己被难住，你能帮帮他么？

前后维护一个前后缀的背包 DP ，然后合并。单调队列优化 DP 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int inf=2147483647;

int n;
int W[maxN],V[maxN],C[maxN];
int F[maxN][maxN],G[maxN][maxN];
pair<int,int> Q[maxN];

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d%d%d",&W[i],&V[i],&C[i]);
	for (int i=1;i<=n;i++){
		C[i]=min(C[i],1000/W[i]);
		for (int j=0;j<=1000;j++) F[i][j]=F[i-1][j];
		for (int d=0;d<W[i];d++){
			int L=1,R=0;
			for (int k=d;k<=1000;k+=W[i]){
				int key=F[i-1][k]-(k-d)/W[i]*V[i];
				while ((L<=R)&&(Q[R].second<=key)) --R;
				Q[++R]=make_pair(k,key);
				while ((L<=R)&&((k-Q[L].first)/W[i]>C[i])) ++L;
				if (L<=R) F[i][k]=max(F[i][k],Q[L].second+(k-d)/W[i]*V[i]);
			}
		}
	}
	for (int i=n;i>=1;i--){
		for (int j=0;j<=1000;j++) G[i][j]=G[i+1][j];
		for (int d=0;d<W[i];d++){
			int L=1,R=0;
			for (int k=d;k<=1000;k+=W[i]){
				int key=G[i+1][k]-(k-d)/W[i]*V[i];
				while ((L<=R)&&(Q[R].second<=key)) --R;
				Q[++R]=make_pair(k,key);
				while ((L<=R)&&((k-Q[L].first)/W[i]>C[i])) ++L;
				if (L<=R) G[i][k]=max(G[i][k],Q[L].second+(k-d)/W[i]*V[i]);
			}
		}
	}
	int Q;scanf("%d",&Q);
	while (Q--){
		int id,w;scanf("%d%d",&id,&w);id++;
		int Ans=0;
		for (int i=0;i<=w;i++) Ans=max(Ans,F[id-1][i]+G[id+1][w-i]);
		printf("%d\n",Ans);
	}
	return 0;
}
```